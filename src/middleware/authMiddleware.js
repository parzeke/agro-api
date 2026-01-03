import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            console.log("TOKEN TO VERIFY:", token);
            console.log("JWT_SECRET SET:", !!process.env.JWT_SECRET);
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("DECODED:", decoded);
            req.user = decoded;
            next();
        } catch (error) {
            console.error("JWT VERIFY ERROR:", error.message);
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};
