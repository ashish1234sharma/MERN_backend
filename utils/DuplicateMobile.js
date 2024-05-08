import users from "../models/users.js";

export const DuplicateMobile = async (req, res, next) => {
    const { mobile } = req?.body;

    try {
        const oldEmail = await users.findOne({ mobile });
        if (oldEmail) return res.status(400).json({ message: "Mobile number already exist" });
        next()
    } catch (error) {
        res.status(404).json({ error });
    }
}