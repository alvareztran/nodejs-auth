import multer from "multer";
import path from 'path';

// Set multer storage
const storage = multer.diskStorage({
    // Folder contains uploaded files
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    // Uploaded filename
    filename: function (req, file, cb) {
        cb(null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        )
    }
})

// Function to control which files are accepted
const checkFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('File uploaded is not an image. Please upload only images.'))
    }
}

// Middleware
const uploadMiddleware = multer({
    storage: storage,
    fileFilter: checkFileFilter,
    limits: {
        fileSize: 5*1024*1024 // 5MB
    }
}) 

export default uploadMiddleware;