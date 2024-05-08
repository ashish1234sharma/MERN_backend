import mongoose from "mongoose";

export const DATABASE = async () => {
    mongoose.set('strictQuery', true)
    const db = await mongoose.connect(process?.env?.ATLAS_URI);
    return db;
}