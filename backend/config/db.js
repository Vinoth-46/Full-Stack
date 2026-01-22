import mongoose from "mongoose";

export const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        console.error("❌ MONGODB_URI is not defined in environment variables!");
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoUri);
        console.log("DB Connected");
    } catch (error) {
        console.error("❌ DB Connection Error:", error);
        process.exit(1);
    }
}
