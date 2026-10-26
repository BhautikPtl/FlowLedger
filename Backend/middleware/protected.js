const jwt = require('jsonwebtoken');
const User = require('../modules/UserModule');

const verifyToken = (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.id) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.userId = decoded.id;
        req.userRole = decoded.role;
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid or expired token'
        });
    }
};

const IsloggedIn = async (req, res, next) => {
    try {
        const currentUser = await User
            .findById(req.userId)
            .select('-password');

        if (!currentUser) {
            return res.status(401).json({
                message: 'User not found'
            });
        }

        req.currentUser = currentUser;
        next();
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(401).json({ message: 'Invalid user session' });
        }

        return res.status(401).json({
            message: 'Authentication failed'
        });
    }
};

const adminOnly = (req, res, next) => {
    if (req.currentUser?.role !== 'sadmin') {
        return res.status(403).json({
            message: 'Forbidden: Admins only'
        });
    }

    next();
};

module.exports = {
    verifyToken,
    IsloggedIn,
    adminOnly
};