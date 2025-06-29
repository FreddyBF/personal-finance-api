import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
export const connectDB = async () => {
    try { 
        const mongoUri = process.env.DATABASE_URL as string;
        await mongoose.connect(mongoUri);
    } catch (error) {
        console.log(`MongoDB connection failed: ${error}`);
        process.exit(1);
    }
}