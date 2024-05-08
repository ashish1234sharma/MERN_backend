import usercart from "../models/usercart.js";

export const AddToCart = async (req, res) => {
    const { product_id, user_id } = req?.body;

    try {
        // Example usage: Create a new user cart document
        const newCart = new usercart({
            product_id,
            user_id
        });

        await newCart.save({

        })
            .then(async (result) => {
                return res.status(201).send({ message: "Successfully added" });
            })
            .catch(error => {
                return res.status(404).send({ message: 'Faield to add cart', error })
            })
    } catch (error) {
        return res.status(400).send({ message: "Faield to add cart", error })
    }
}
export const GetCartProducts = async (req, res) => {
    const { currentPage = 1, pageSize = 25, } = req?.query;

    try {
        const LIMIT = Number(pageSize);
        const startIndex = (Number(currentPage === "0" ? "1" : currentPage) - 1) * LIMIT;
        const total = await usercart.find().count();

        const data = await usercart.aggregate([
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
        return res.status(200).send({
            data: [],
            currentPage: 1,
            totalPage: 0,
            numberOfData: 0
        });
    }
}
export const DeleteCart = async (req, res) => {
    const { _id } = req?.params;

    try {
        await usercart.findOneAndDelete({ _id: _id })
            .then(async (deleted) => {
                return res.status(200).send({ message: "Successfully delete cart" });
            })
            .catch((error) => {
                res.status(404).send({ error, message: "Failed to delete cart" })
            })
    } catch (error) {
        return res.status(400).send({ message: "Unable to delete" })
    }
}