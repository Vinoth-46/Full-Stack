import mongoose from "mongoose";

export const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://vinoth:Vinoth462005%40@cluster0.mq6a4.mongodb.net/food-delivery?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(mongoUri).then(() => console.log("DB Connected"));
}