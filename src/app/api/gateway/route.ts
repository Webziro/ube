import { rideServerManager } from '@/lib/rideStateServer';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        start(controller) {
            // Send connection acknowledgment event
            const initialEvent = `data: ${JSON.stringify({
                event: 'CONNECTED',
                timestamp: new Date().toISOString(),
                activeRide: rideServerManager.getActiveRide(),
            })}\n\n`;
            controller.enqueue(encoder.encode(initialEvent));

            // Subscribe to real-time events from rideServerManager
            const unsubscribe = rideServerManager.subscribe((data) => {
                const sseFormatted = `data: ${JSON.stringify(data)}\n\n`;
                controller.enqueue(encoder.encode(sseFormatted));
            });

            // Keep-alive ping interval to prevent stream timeouts
            const pingInterval = setInterval(() => {
                try {
                    controller.enqueue(encoder.encode(`: ping\n\n`));
                } catch (e) {
                    clearInterval(pingInterval);
                }
            }, 15000);

            // Handle client abort / disconnect
            request.signal.addEventListener('abort', () => {
                clearInterval(pingInterval);
                unsubscribe();
                controller.close();
            });
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive',
        },
    });
}
