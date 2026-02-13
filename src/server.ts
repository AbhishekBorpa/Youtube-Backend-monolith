import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app';
import { createServer } from 'http';
import { initializeSocket } from './socket';

dotenv.config();

const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yu';

const server = createServer(app);
const io = initializeSocket(server);

// App state to include io
(app as any).set("io", io);

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        process.exit(1);
    }
};

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
    });
});
