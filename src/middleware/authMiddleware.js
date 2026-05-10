import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
            console.log(token);
        }

        console.log("headers", req.headers);

        if (!token) {
            return res.status(401).json({ message: "Not Authorized" });
        }

        // Verify the token
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decode.id);
        req.user = await User.findByPk(decode.id, {
            attributes: { exclude: ["password"] }
        });

        console.log("req.user", req.user);
        next();

    } catch (err) {
        res.status(401).json({ message: "Token invalid" });
    }
};

export default authMiddleware;