import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const secretKey = process.env.PAYSTACK_SECRET_KEY || '';
        const bodyText = await request.text();

        // Validate Paystack Signature Header if Secret Key is configured
        const signature = request.headers.get('x-paystack-signature');
        if (secretKey && signature) {
            const hash = crypto
                .createHmac('sha512', secretKey)
                .update(bodyText)
                .digest('hex');

            if (hash !== signature) {
                return NextResponse.json(
                    { success: false, message: 'Invalid Paystack signature' },
                    { status: 401 }
                );
            }
        }

        const event = JSON.parse(bodyText);

        // Process successful payment events
        if (event.event === 'charge.success') {
            const data = event.data;
            const amountInNaira = data.amount / 100;
            const reference = data.reference;
            const customerEmail = data.customer?.email;

            console.log(`[Paystack Webhook] Charge Success: ₦${amountInNaira} for ${customerEmail} (Ref: ${reference})`);

            try {
                const { connectToDatabase } = await import('@/lib/mongodb');
                const conn = await connectToDatabase();
                if (conn) {
                    const { UserModel } = await import('@/models/User');
                    if (UserModel) {
                        await UserModel.updateOne(
                            { email: customerEmail },
                            {
                                $inc: { walletBalance: amountInNaira },
                            }
                        );
                    }
                }
            } catch (dbErr) {
                console.error('[Paystack Webhook] DB Update error:', dbErr);
            }
        }

        return NextResponse.json({ status: 'success' }, { status: 200 });
    } catch (error: any) {
        console.error('Paystack webhook error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Webhook handler error' },
            { status: 500 }
        );
    }
}
