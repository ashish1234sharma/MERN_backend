import products from "../models/products.js";
import users from '../models/users.js';
import checkout from "../models/checkout.js";
import usercart from "../models/usercart.js";

export const GetSummary = async (req, res) => {

    try {
        const totalProduct = await products.find().count()
        const totalUser = await users.find().count()
        const totalCheckOut = await checkout.find().count()
        const totalUserCart = await usercart.find().count()

        return res.status(200).send({
            totalProduct: totalProduct || 0,
            totalUser: totalUser || 0,
            totalCheckOut: totalCheckOut || 0,
            totalUserCart: totalUserCart || 0
        })
    } catch (error) {
        return res.status(200).send({
            totalProduct: 0,
            totalUser: 0,
            totalCheckOut: 0,
            totalUserCart: 0,
        })
    }
}