import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI);
        console.log("Database connection successfully.");
    } catch (err) {
        console.log("Database connection failed: ", err);
        process.exit(1);
    }
}

export default connectDb;