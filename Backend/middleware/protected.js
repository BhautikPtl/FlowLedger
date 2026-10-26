const jwt = require("jsonwebtoken");


const verifyToken = (req) => {
    const token = req.cookies?.token;
    if (!token) return null;

    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};


const IsloggedIn = (req, res, next) => {
    const decoded = verifyToken(req);

    if (!decoded) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
};


const adminOnly = (req, res, next) => {

    let role = req.userRole;
    let userId = req.userId;


    if (!userId) {
        const decoded = verifyToken(req);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        userId = decoded.id;
        role = decoded.role;
        req.userId = userId;
    }

    if (role !== "sadmin") {
        return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    next();
};

module.exports = { verifyToken, IsloggedIn, adminOnly };
