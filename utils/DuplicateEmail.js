import users from '../models/users.js'

export const DuplicateEmail = async (req, res, next) => {
    const { email } = req?.body;

    try {
        const oldEmail = await users.findOne({ email });
        if (oldEmail) return res.status(400).json({ message: "Email address already exist" });
        next()
    } catch (error) {
        res.status(404).json({ error });
    }
}