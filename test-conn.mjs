import dotenv from 'dotenv';
dotenv.config({ path: '.env.local', override: true });
import mongoose from 'mongoose';
const uri = process.env.MONGODB_URI;
console.log('Attempting connection to', uri);
mongoose.connect(uri, { bufferCommands: false, serverSelectionTimeoutMS: 10000 })
    .then(() => { console.log('✅ Connected!'); process.exit(0); })
    .catch(err => { console.error('❌ Connection failed:', err.message); console.error(err.stack); process.exit(1); });
