import mongoose from "mongoose";

const checkout = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Please provide a user id"],
        unique: false,
    },
    checkout_id: {
        type: mongoose.Schema.Types.String,
        unique: true,
        required: [true, "Please provide a checkout id"],
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Please provide a user id"],
        unique: false,
    },
    amount: { type: mongoose.Schema.Types.Number, default: 0, require: [true] },
    payment_mode: { type: mongoose.Schema.Types.String, default: null, require: [true], enum: ['card', 'cash', 'upi', 'online banking'] },
    payment_status: { type: mongoose.Schema.Types.String, default: null, require: [true], enum: ['paid', 'unpaid', 'pending',] },
    currency: { type: mongoose.Schema.Types.String, default: "inr", require: [true] },
    createdAt: { type: mongoose.Schema.Types.Date, default: Date.now() },
    updatedAt: { type: mongoose.Schema.Types.Date, default: Date.now() },
});

export default mongoose.model.checkout || mongoose.model('checkout', checkout);