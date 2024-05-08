import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

/** auth middleware */
export async function Auth(req, res, next) {
    // console.log(req.headers.authorization)
    try {
        const token = req.headers.authorization.split(" ")[1];

        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decodedToken?.userId;
        next()
    } catch (error) {
        res.status(401).json({ error: "Authentication Failed!" })
    }
}
