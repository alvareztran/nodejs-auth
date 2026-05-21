import app from './app.js';
import connectDb from './config/db.js';

const startServer = async () => {
    try {
        await connectDb();
        app.on("error", (err) => {
            console.log("Error: ", err);
            throw err;
        })
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port: ${process.env.PORT}`);
        })
    } catch (err) {
        console.log("Server connection failed: ", err.message);
    }
}

startServer();