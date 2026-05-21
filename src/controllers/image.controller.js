import Image from '../models/image.model.js';
import cloudinary from '../config/cloudinary.js';
import { uploadToCloudinary } from '../helpers/cloudinary.helper.js';
import fs from 'fs';

const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "File is required. Please upload an image."
            })
        }
        const { url, publicId } = await uploadToCloudinary(req.file.path);
        const newImage = new Image({
            url,
            publicId,
            uploadedBy: req.userInfo.userId
        })
        await newImage.save();
        fs.unlinkSync(req.file.path);
        res.status(201).json({
            success: true,
            message: "Image uploaded successfully.",
            image: newImage
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Somethings went wrong! Please try again.",
            error: err.message
        })
    }
}

const fetchImages = async (req, res) => {
    try {
        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1)*limit;
        
        const sortBy = req.query.sortBy || 'createAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages / limit);

        const sortObj = {};
        sortObj[sortBy] = sortOrder;
        const images = await Image.find({}).sort(sortObj).skip(skip).limit(limit);

        if (images) {
            return res.status(200).json({
                success: true,
                message: "All images fetched successfully.",
                currentPage: page,
                totalPages,
                totalImages,
                data: images
            })
        }
    } catch (err) {
        res.status(500).json({
            success: false, 
            message: "Internal Server Error",
            error: err.message
        })   
    }
}

const deleteImage = async (req, res) => {
    try {
        const imageId = req.params.id;
        const userId = req.userInfo.userId;
        const image = await Image.findById(imageId);
        if (!image) {
            return res.status(404).json({
                success: false,
                message: "Image not found."
            })
        }
        if (image.uploadedBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this image."
            })
        }
        await cloudinary.uploader.destroy(image.publicId);
        await Image.findByIdAndDelete(image);
        res.status(200).json({
            success: true,
            message: "Image deleted successfully."
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: "Interal Server Error",
            error: err.message
        })
    }
}

export { uploadImage, fetchImages, deleteImage };