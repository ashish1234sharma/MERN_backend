import users from '../models/users.js'

export const UpdateValidation = async (req, res, next) => {
    const { email, mobile } = req?.body;
    console.log(email)
    try {
        const oldEmail = await users.findOne({ email })
        /* if (oldEmail !== null) */ return res.status(404).send({ error, message: "Email alrady exist" });
        next()
    } catch (error) {
        return res.status(400).send({ error, message: "Faield to update profile" });
    }
}