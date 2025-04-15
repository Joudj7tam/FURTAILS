import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://Jood_Talal:tTwTllbE48p22ncT@cluster0.mbjujyn.mongodb.net/FurTails').then(()=>console.log("DB Connected"));
}