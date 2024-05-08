import * as dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose'
import users from '../models/users.js';

dotenv.config()
export const SignIn = async (req, res, next) => {
    const { username, password } = req?.body;

    try {
        await users.findOne({ $or: [{ "email": username }, { "username": username }] })
            .then((user) => {
                bcrypt.compare(password, user?.password)
                    .then(passwordCheck => {
                        if (!passwordCheck) return res.status(400).send({ message: "Incorrect Password" });
                        const token = jwt.sign({ userId: user?._id, email: user?.email }, process?.env?.JWT_SECRET, { expiresIn: "24d" });
                        delete user?._doc?.password
                        delete user?._doc?.address
                        return res.status(200).send({ ...user?._doc, token });
                    })
                    .catch(error => {
                        return res.status(400).send({ message: "Password does not Match" })
                    })
            })
            .catch(error => {
                return res.status(404).send({ message: "unable to login please try again" });
            });
    } catch (error) {
        return res.status(400).send({ message: "unable to login please try again" });
    }
}
export const SignUp = async (req, res, next) => {
    const { firstName, lastName, email, mobile, password } = req?.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        await users.create({
            name: firstName + " " + lastName,
            firstName,
            lastName,
            email,
            mobile,
            username: email?.split("@")[0],
            password: hashedPassword,
        })
            .then(async (result) => {
                return res.status(201).send({ message: "User Register Successfully" });
            })
            .catch(error => { return res.status(404).send({ message: 'User Register Faield', error }) });
    } catch (error) {
        return res.status(400).send({ message: 'User Register Faield', error })
    }
}
export const GetUsers = async (req, res, next) => {
    const { _id } = req?.params
    const { currentPage = 1, pageSize = 20, } = req?.query;

    try {
        const LIMIT = Number(pageSize);
        const startIndex = (Number(currentPage) - 1) * LIMIT;
        const _useridQuery = (_id && { _id: new mongoose.Types.ObjectId(_id) })

        const total = await users.find().count()
        const data = await users.aggregate([
            { $match: { ..._useridQuery } },
            { $sort: { _id: -1 } },
            { $skip: startIndex },
            { $limit: LIMIT },
            {
                $project: {
                    password: 0,
                    __v: 0,
                    ...(!_id && { address: 0 })
                }
            },
        ])

        if (_id) {
            return res.status(200).json(Object.assign({}, ...data))
        } else {
            return res.status(200).json({
                data,
                currentPage: !currentPage ? 1 : Number(currentPage),
                totalPage: !pageSize ? 1 : Math.ceil(total / LIMIT),
                numberOfData: total
            });
        }
    } catch (error) {
        if (_id) {
            return res.status(404).json({ error, message: "Not found" })
        } else {
            return res.status(200).json({
                data: [],
                currentPage: 1,
                totalPage: 0,
                numberOfData: 0
            });
        }
    }
}
export const GetProfile = async (req, res, next) => {
    const { _id } = req?.userId;

    try {
        await users.findOne({ _id: req?.userId }, { address: 0, password: 0, __v: 0 })
            .then((user) => {
                return res.status(200).json(user)
            })
            .catch((error) => {
                return res.status(404).json({ error, message: "User not found" })
            })

    } catch (error) {
        return res.status(400).json({ error, message: "Not found" })
    }
}
export const FindUser = async (req, res, next) => {
    const { username } = req?.params;
    try {
        await users.findOne({ $or: [{ "email": username }, { "username": username }] })
            .then((user) => {
                if (!user) return res.status(404).json({ error, message: "User not found" })
                delete user?._doc?.password
                delete user?._doc?.address
                return res.status(200).send({ ...user?._doc, });
            })
            .catch(error => {
                return res.status(404).send({ message: "unable to login please try again" });
            });
    } catch (error) {
        return res.status(400).json({ error, message: "User not found" })
    }
}
export const UserUpdate = async (req, res, next) => {
    const { _id } = req?.params;
    const { firstName, lastName, email, mobile, profileImage } = req?.body;

    try {
        await users.findByIdAndUpdate({ _id: _id }, {
            firstName,
            lastName,
            email,
            mobile,
            profileImage,
            name: firstName + " " + lastName,
            updatedAt: Date.now()
        }, { new: true })
            .then((user) => {
                delete user?._doc?.password
                return res.status(200).send({ data: user?._doc, message: "Profile update successfully" });
            })
            .catch((error) => {
                return res.status(404).send({ error, message: "Faield to update profile" });
            })
    } catch (error) {
        return res.status(400).send({ error, message: "Faield to update profile" });
    }
}
export const UserAddressUpdate = async (req, res, next) => {
    const { _id } = req?.params;
    const { address, landmark, city, state, country, pincode, address_type, } = req?.body;

    try {
        await users.findByIdAndUpdate({ _id: _id }, {
            address: {
                address,
                landmark,
                city,
                state,
                country,
                pincode,
                address_type,
            },
            updatedAt: Date.now()
        }, { new: true })
            .then((user) => {
                delete user?._doc?.password
                return res.status(200).send({ data: user?._doc, message: "Address update successfully" });
            })
            .catch((error) => {
                return res.status(404).send({ error, message: "Faield to update Address" });
            })
    } catch (error) {
        return res.status(404).send({ error, message: "Faield to update Address" });
    }
}
export const PasswordReset = async (req, res, next) => {
    const { _id } = req?.params;
    const { previousPassword, newPassword } = req?.body;
    try {
        await users.findOne({ _id })
            .then((user) => {
                bcrypt.compare(previousPassword, user?.password)
                    .then(passwordCheck => {
                        if (!passwordCheck) return res.status(400).send({ message: "Incorrect old  Password" });
                        bcrypt.hash(newPassword, 10)
                            .then(hashedPassword => {
                                users.updateOne({ _id, email: user?.email }, { password: hashedPassword })
                                    .then((user) => {
                                        return res.status(200).send({ message: "Password updated successfully" });
                                    })
                                    .catch(() => {
                                        return res.status(200).send({ message: "Password updated faield" });
                                    })
                            })
                            .catch(error => {
                                return res.status(400).send({ message: "Incorrect old  Password" })
                            })
                    })
                    .catch(error => {
                        return res.status(400).send({ message: "Incorrect old  Password" })
                    })
            })
            .catch(() => {
                return res.status(400).send({ message: "User updated faield" });
            })
    } catch (error) {
        return res.status(404).send({ message: "User updated faield" });
    }
}
export const PasswordForgot = async (req, res, next) => {
    const { _id } = req?.params;
    const { newPassword } = req?.body;
    try {
        bcrypt.hash(newPassword, 10)
            .then(async function (hashedPassword) {
                await users.updateOne({ _id }, { password: hashedPassword })
                    .then((user) => {
                        return res.status(200).send({ message: "Password forgot successfully" });
                    })
                    .catch(() => {
                        return res.status(400).send({ message: "Password forgot faield" });
                    })
            })
    } catch (error) {
        return res.status(404).send({ message: "Password forgot faield" });
    }
}