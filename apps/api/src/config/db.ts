import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

let isConnected = false;

export async function connectDB(): Promise<boolean> {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sweet_pearl_bakes';
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to ${uri}`);
    return true;
  } catch (error) {
    console.warn('[MongoDB] MongoDB not detected locally; activating local embedded store fallback for seamless localhost execution.');
    isConnected = false;
    return false;
  }
}

export function isMongoConnected(): boolean {
  return isConnected;
}
