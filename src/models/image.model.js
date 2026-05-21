import mongoose from "mongoose";
import { Schema } from "mongoose";

const imageSchema = new Schema ({
    url: {
        type: String,
        required: true,
    },
    publicId: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const Image = mongoose.model("Image", imageSchema);
export default Image;