import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath);
        return {
            url: result.secure_url,
            publicId: result.public_id
        }
    } catch (err) {
        console.log("Error occurs while upload to Cloudinary.");
        throw new Error("Error occurs while upload to Cloudinary.");
    }
}

export { uploadToCloudinary };