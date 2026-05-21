import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get("/index", authMiddleware, (req, res) => {
    const { username, userId, role } = req.userInfo;
    res.json({
        message: "Welcome to the homepage.",
        user: {
            _id: username,
            userId, 
            role
        }
    })
});

export default router;