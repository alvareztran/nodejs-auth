import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import adminMiddleware from '../middlewares/admin.middleware.js';

const router = express.Router();

router.get("/index", authMiddleware, adminMiddleware, (req, res) => {
    res.json({
        message: "Welcome to the admin page."
    })
});

export default router;