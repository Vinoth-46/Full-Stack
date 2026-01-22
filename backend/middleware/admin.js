import userModel from '../models/userModel.js';

const adminMiddleware = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Access Denied: Admin only" });
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error verifying admin status" });
    }
};

export default adminMiddleware;
