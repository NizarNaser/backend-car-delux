import mongoose from "mongoose";


export const connectDB = async () => {
    await mongoose.connect("mongodb+srv://nizarnaser89:Nizar_Mark1970@cardelux.nbube3j.mongodb.net/").then(()=>console.log("DB Connected"));
}

