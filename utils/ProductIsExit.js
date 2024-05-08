import mongoose from "mongoose";
import products from "../models/products.js";

export const ProductIsExit = async (req, res, next) => {
    const { _id } = req?.body && req?.params;
    const { _productid } = req?.body && req?.params;

    try {
        if (mongoose.Types.ObjectId.isValid(_id || _productid)) {
            if (await products.findOne({ _id: _productid || _id })) {
                next();
            } else {
                return res.status(404).json({ message: "Product not exist" });
            };
        } else {
            return res.status(404).send({ message: 'Product not exit' });
        };
    } catch (error) {
        return res.status(404).send({ message: 'Product not exit' });
    };
};