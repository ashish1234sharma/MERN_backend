import mongoose from "mongoose";
import users from "../models/users.js";

export const UserIdExit = async (req, res, next) => {
    const { _id, } = req?.body && req?.params;
    const { _userid } = req?.body && req?.params;

    try {
        if (mongoose.Types.ObjectId.isValid(_id || _userid)) {
            if (await users.findOne({ _id: _userid || _id })) {
                next()
            } else {
                return res.status(404).json({ message: "User not exist" })
            };
        } else {
            return res.status(404).send({ message: 'User not exit' });
        };
    } catch (error) {
        return res.status(404).send({ message: 'User not exit' });
    };
};