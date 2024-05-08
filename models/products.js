import mongoose from "mongoose";

const products = new mongoose.Schema({
    title: { type: mongoose.Schema.Types.String, default: null, require: [true] },
    description: { type: mongoose.Schema.Types.String, default: null },
    category: { type: mongoose.Schema.Types.String, default: null, require: [true] },

    actual_price: { type: mongoose.Schema.Types.Number, default: 0, require: [true] },
    sale_price: { type: mongoose.Schema.Types.Number, default: 0, require: [true] },
    discount_price: { type: mongoose.Schema.Types.Number, default: 0, require: [true] },
    isDiscount: { type: mongoose.Schema.Types.String, default: false, require: [true], enum: [true, false] },
    discount_percent: { type: mongoose.Schema.Types.String, default: '0%', },

    authour: { type: mongoose.Schema.Types.String, default: null },
    currency: { type: mongoose.Schema.Types.String, default: "inr", require: [true] },
    publishedAt: { type: mongoose.Schema.Types.Date, default: null },
    manufacturedAt: { type: mongoose.Schema.Types.Date, default: null },
    publishedby: { type: mongoose.Schema.Types.String, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, default: null, require: [true] },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, default: null, require: [true] },
    thumbnails: { type: [mongoose.Schema.Types.String], default: [], },
    createdAt: { type: mongoose.Schema.Types.Date, default: Date.now() },
    updatedAt: { type: mongoose.Schema.Types.Date, default: Date.now() },
});

export default mongoose.model.products || mongoose.model('products', products);