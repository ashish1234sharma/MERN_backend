import mongoose from "mongoose";

const users = new mongoose.Schema({
    password: {
        type: mongoose.Schema.Types.String,
        required: [true, "Please provide a password"],
        unique: true,
        minlength: 8,
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9\s]).{8,}$/, `Password must bee minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character`],
    },
    email: {
        type: mongoose.Schema.Types.String,
        required: [true, "Please provide a email address"],
        unique: true,
        match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, `Please fill valid email address`],
    },
    mobile: {
        type: mongoose.Schema.Types.Number,
        required: [true, "Please provide a mobile number"],
        unique: true,
    },
    username: { type: mongoose.Schema.Types.String, default: null },
    firstName: { type: mongoose.Schema.Types.String, required: [true, "Please provide a first name"], },
    lastName: { type: mongoose.Schema.Types.String, required: [true, "Please provide a last name"], },
    name: { type: mongoose.Schema.Types.String, required: [true, "Please provide a last name"], },
    user_type: { type: mongoose.Schema.Types.String, default: 'user', enum: ['user', 'admin'] },
    profileImage: { type: mongoose.Schema.Types.String, default: null },
    address: {
        address: { type: mongoose.Schema.Types.String, default: null, },
        landmark: { type: mongoose.Schema.Types.String, default: null, },
        city: { type: mongoose.Schema.Types.String, default: null, },
        state: { type: mongoose.Schema.Types.String, default: null, },
        country: { type: mongoose.Schema.Types.String, default: null, },
        pincode: { type: mongoose.Schema.Types.Number, default: null, },
        address_type: { type: mongoose.Schema.Types.String, default: null, enum: ["home", "work", "rental"] },
    },
    createdAt: { type: mongoose.Schema.Types.Date, default: Date.now() },
    updatedAt: { type: mongoose.Schema.Types.Date, default: Date.now() },
});

export default mongoose.model.users || mongoose.model('users', users);