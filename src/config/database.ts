import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
    try { 
        const mongoUri = process.env.DATABASE_URL as string;
        await mongoose.connect(mongoUri);
        console.log('MongoDB connected sucessfully');
    } catch (error) {
        console.log(`MongoDB connection failed: ${error}`);
        process.exit(1);
    }
}