import 'dotenv/config';
import express from 'express';
import authRoutes from './routes/auth.route.js';
import homeRoutes from './routes/home.route.js';
import adminRoutes from './routes/admin.route.js';
import imageRoutes from './routes/image.route.js';

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/image", imageRoutes);

export default app;