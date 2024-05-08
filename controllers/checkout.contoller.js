import moment from "moment";
import mongoose from "mongoose";
import checkout from "../models/checkout.js";

export const ProductCheckout = async (req, res) => {
    const { _productid } = req?.params;
    const { amount, currency, payment_mode } = req?.body;

    try {
        await checkout.create({
            product_id: _productid,
            checkout_id: `${moment().format("ddd").toLocaleUpperCase()}${Date.now()}${moment().format("MMM").toLocaleUpperCase()}`,
            user_id: req?.userId,
            amount: amount,
            currency,
            payment_mode,
            payment_status
        })
            .then(async (result) => {
                return res.status(201).send({ message: "Successfully checkout" });
            })
            .catch(error => { return res.status(404).send({ message: 'Faield to checkout', error }) });
    } catch (error) {
        return res.status(400).send({ message: 'Faield to checkout', error })
    }
}
export const HistoryCheckouts = async (req, res) => {
    const { _id } = req?.params;
    const { currentPage = 1, pageSize = 25, } = req?.query;

    try {
        const LIMIT = Number(pageSize);
        const startIndex = (Number(currentPage === "0" ? "1" : currentPage) - 1) * LIMIT;
        const _productidQuery = (_id && { _id: new mongoose.Types.ObjectId(_id) })
        const total = await checkout.find().count();

        const data = await checkout.aggregate([
            { $match: { ..._productidQuery } },
            { $sort: { _id: -1 } },
            { $skip: startIndex },
            { $limit: LIMIT },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "user_id",
                    "foreignField": "_id",
                    "as": "user_id",
                    "pipeline": [
                        { "$project": { "password": 0, } }
                    ]
                },
            },
            { $unwind: "$user_id" },
            {
                "$lookup": {
                    "from": "products",
                    "localField": "product_id",
                    "foreignField": "_id",
                    "as": "product_id",
                },
            },
            { $unwind: "$product_id" },
        ])

        if (_id) {
            return res.status(200).json(Object.assign({}, ...data))
        } else {
            return res.status(200).send({
                data,
                currentPage: currentPage === "0" ? 1 : !currentPage ? 1 : Number(currentPage),
                totalPage: !pageSize ? 1 : Math.ceil(total / LIMIT),
                numberOfData: total
            });
        }
    } catch (error) {
        return res.status(200).send({
            data: [],
            currentPage: 1,
            totalPage: 0,
            numberOfData: 0
        });
    }
}
export const HistoryCheckoutsByUser = async (req, res) => {
    const { _id } = req?.params;
    const { currentPage = 1, pageSize = 25, } = req?.query;

    try {
        const LIMIT = Number(pageSize);
        const startIndex = (Number(currentPage === "0" ? "1" : currentPage) - 1) * LIMIT;
        const _productidQuery = (_id && { user_id: new mongoose.Types.ObjectId(_id) })
        const total = await checkout.find({ user_id: new mongoose.Types.ObjectId(_id) }).count();

        const data = await checkout.aggregate([
            { $match: { ..._productidQuery } },
            { $sort: { _id: -1 } },
            { $skip: startIndex },
            { $limit: LIMIT },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "user_id",
                    "foreignField": "_id",
                    "as": "user_id",
                    "pipeline": [
                        { "$project": { "password": 0, } }
                    ]
                },
            },
            { $unwind: "$user_id" },
            {
                "$lookup": {
                    "from": "products",
                    "localField": "product_id",
                    "foreignField": "_id",
                    "as": "product_id",
                },
            },
            { $unwind: "$product_id" },
        ])

        return res.status(200).send({
            data,
            currentPage: currentPage === "0" ? 1 : !currentPage ? 1 : Number(currentPage),
            totalPage: !pageSize ? 1 : Math.ceil(total / LIMIT),
            numberOfData: total
        });
    } catch (error) {

    }
}