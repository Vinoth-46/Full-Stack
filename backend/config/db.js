import mangoose from "mongoose";


export const connectDB = async () =>{
    await mangoose.connect('mongodb+srv://vinothuser:9342928834@cluster0.8w4kxbr.mongodb.net/food-del').then(()=> console.log("DB Connected"));
}