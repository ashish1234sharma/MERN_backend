import users from "../models/users.js";

export const UserExist = async (req, res, next) => {
    const { username } = req?.body;

    try {
        await users.findOne({ $or: [{ "email": username || req?.params?.username }, { "username": username || req?.params?.username }] })
            .then((user) => {
                if (!user) return res.status(404).json({ message: "User not exist" })
                next()
            })
            .catch(() => {
                return res.status(404).json({ message: "User not exist" })
            })
    } catch (error) {
        return res.status(500).json({ message: "User not exist" })
    }
}