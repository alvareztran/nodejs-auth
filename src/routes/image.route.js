import express from 'express';
import { uploadImage, fetchImages, deleteImage } from '../controllers/image.controller.js';
import adminMiddleware from '../middlewares/admin.middleware.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import uploadMiddleware from '../middlewares/upload.middleware.js';

const router = express.Router();

router.post("/upload", authMiddleware, adminMiddleware, uploadMiddleware.single('image'), uploadImage);
router.get("/get", authMiddleware, fetchImages);
router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteImage);

export default router;