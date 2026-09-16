import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://stanleyamaziro_db_user:zMGMLAj3oZSRhCEF@cluster0.z6nzthy.mongodb.net/ube?retryWrites=true&w=majority';

const UserSchema = new mongoose.Schema(
    {
        id: { type: String, required: true, unique: true },
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        phone: { type: String, required: true, unique: true, trim: true },
        passwordHash: { type: String, required: true },
        role: { type: String, enum: ['passenger', 'driver', 'admin'], default: 'passenger' },
        rating: { type: Number, default: 5.0 },
        totalTrips: { type: Number, default: 0 },
        isVerified: { type: Boolean, default: true },
        avatarUrl: { type: String },
        failedLoginAttempts: { type: Number, default: 0 },
        lockoutUntil: { type: Date, default: null },
        vehicle: {
            make: { type: String },
            model: { type: String },
            color: { type: String },
            plate: { type: String },
            tier: { type: String },
        },
        earnings: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seed() {
    console.log('🌱 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to database.');

    const defaultPasscode = '1234';
    const passwordHash = await bcrypt.hash(defaultPasscode, 12);

    const usersToSeed = [
        {
            id: 'usr_pass_001',
            fullName: 'Alex Morgan',
            email: 'alex.morgan@ube.ng',
            phone: '+234 801 234 5678',
            passwordHash,
            role: 'passenger',
            rating: 4.92,
            totalTrips: 42,
            isVerified: true,
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        },
        {
            id: 'usr_drv_002',
            fullName: 'Babatunde Lawal',
            email: 'babatunde.lawal@ube.ng',
            phone: '+234 809 876 5432',
            passwordHash,
            role: 'driver',
            rating: 4.96,
            totalTrips: 384,
            isVerified: true,
            avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
            vehicle: {
                make: 'Toyota',
                model: 'Camry Hybrid',
                color: 'Onyx Black',
                plate: 'LAG-849-XY',
                tier: 'Ube Comfort',
            },
            earnings: 245000,
        },
    ];

    for (const u of usersToSeed) {
        const existing = await User.findOne({ $or: [{ email: u.email }, { phone: u.phone }, { id: u.id }] });
        if (existing) {
            console.log(`ℹ️ User ${u.fullName} (${u.email}) already exists. Updating...`);
            await User.updateOne({ _id: existing._id }, { $set: u });
        } else {
            console.log(`✨ Creating user ${u.fullName} (${u.email})...`);
            await User.create(u);
        }
    }

    console.log('🎉 Database seeding complete!');
    await mongoose.disconnect();
    process.exit(0);
}

seed().catch((err) => {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
});
