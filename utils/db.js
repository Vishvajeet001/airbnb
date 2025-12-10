import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const { MONGODB_URL } = process.env;

export default async connectDB => {

    try {

        await mongoose.connect(MONGODB_URL);

        console.log("MongoDB is connected successfully");
    
    } catch (err) {
    
        console.log("MongoDB connection failure!", err);
    
    }
}