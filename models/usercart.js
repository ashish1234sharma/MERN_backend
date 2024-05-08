import mongoose from "mongoose";

const usercart = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // unique: false
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // unique: false
    },
    createdAt: { type: mongoose.Schema.Types.Date, default: Date.now() },
    updatedAt: { type: mongoose.Schema.Types.Date, default: Date.now() },
});

export default mongoose.model.usercart || mongoose.model('usercart', usercart);