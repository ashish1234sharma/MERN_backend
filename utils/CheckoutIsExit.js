import mongoose from "mongoose";
import checkout from "../models/checkout.js";

export const CheckoutIsExit = async (req, res, next) => {
    const { _id } = req?.body && req?.params;
    const { _checkoutid } = req?.body && req?.params;

    try {
        if (mongoose.Types.ObjectId.isValid(_id || _checkoutid)) {
            if (await checkout.findOne({ _id: _checkoutid || _id })) {
                next();
            } else {
                return res.status(404).json({ message: "Checkout details not exist" });
            };
        } else {
            return res.status(404).send({ message: 'Checkout details not exit' });
        };
    } catch (error) {
        return res.status(404).send({ message: 'Checkout details not exit' });
    };
};