import mongoose from 'mongoose'
import products from "../models/products.js";

export const AddProduct = async (req, res) => {
    const { title, description, category, actual_price, sale_price, discount_price, discount_percent, isDiscount, authour, currency, publishedAt, manufacturedAt, publishedby, thumbnails } = req?.body;

    try {
        
        await products.create({
            title,
            description,
            category,
            actual_price,
            sale_price,
            discount_price,
            isDiscount,
            discount_percent,
            authour,
            currency,
            publishedAt,
            manufacturedAt,
            publishedby,
            thumbnails,
            createdBy: req?.userId,
            updatedBy: req?.userId
        })
            .then(async (result) => {
                return res.status(201).send({ message: "Successfully added product" });
            })
            .catch(error => { return res.status(404).send({ message: 'Faield to add product', error }) });
    } catch (error) {
        return res.status(400).send({ message: 'Faield to add product', error })
    }
}
export const UpdateProduct = async (req, res) => {
    const { _id } = req?.params;
    const { title, description, category, actual_price, sale_price, discount_price, isDiscount, discount_percent, authour, currency, publishedAt, manufacturedAt, } = req?.body;

    try {
        await products.updateOne({ _id: _id },
            {
                title,
                description,
                category,
                actual_price,
                sale_price,
                discount_price,
                isDiscount,
                discount_percent,
                authour,
                currency,
                publishedAt,
                manufacturedAt,
                updatedBy: req?.userId,
                updatedAt: Date.now()
            })
            .then(async (result) => {
                return res.status(201).send({ message: "Successfully updated product" });
            })
            .catch(error => { return res.status(404).send({ message: 'Faield to update product', error }) });
    } catch (error) {
        return res.status(400).send({ message: 'Faield to update product', error })
    }
}
export const GetProducts = async (req, res) => {
    const { _id } = req?.params;
    const { currentPage = 1, pageSize = 25, } = req?.query;

    try {
        const LIMIT = Number(pageSize);
        const startIndex = (Number(currentPage === "0" ? "1" : currentPage) - 1) * LIMIT;
        const _productidQuery = (_id && { _id: new mongoose.Types.ObjectId(_id) })
        const total = await products.find().count();

        const data = await products.aggregate([
            { $match: { ..._productidQuery } },
            { $sort: { _id: -1 } },
            { $skip: startIndex },
            { $limit: LIMIT },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "createdBy",
                    "foreignField": "_id",
                    "as": "createdBy",
                    "pipeline": [
                        { "$project": { "password": 0, "address": 0, "__v": 0 } }
                    ]
                },
            },
            { $unwind: "$createdBy" },
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
        if (_id) {
            return res.status(200).json({})
        } else {
            return res.status(200).send({
                data: [],
                currentPage: 1,
                totalPage: 1,
                numberOfData: 0
            });
        }
    }
}
export const DeleteProduct = async (req, res) => {
    const { _id } = req?.params;

    try {
        await products.findOneAndDelete({ _id: _id })
            .then(async (deleted) => {
                return res.status(200).send({ message: "Successfully delete product" });
            })
            .catch((error) => {
                res.status(404).send({ error, message: "Failed to delete product" })
            })
    } catch (error) {
        return res.status(400).send({ message: 'Faield to delete product', error })
    }
}
