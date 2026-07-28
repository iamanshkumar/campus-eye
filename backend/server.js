import 'dotenv/config';
import express, { json } from 'express';
import connectDB from './config/db.js'
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoutes.js';
import companyRouter from "./routes/companyRoutes.js";
import experienceRouter from './routes/experienceRoutes.js';
import commentRouter from "./routes/commentRoutes.js";
import companyStatusRouter from './routes/companyStatusRoutes.js';
import userRouter from './routes/userRoutes.js';
import notificationRouter from "./routes/notificationRoutes.js";
import cors from 'cors';


const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:5173"].filter(Boolean);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, true); // Permissive CORS fallback for development/production domains
        }
    },
    credentials: true
}));

app.use("/health", (req, res) => {
    res.json({
        success: true,
        message: "Server is running"
    })
});

app.use("/api/auth", authRouter);
app.use("/api/companies", companyRouter);
app.use("/api/experiences", experienceRouter);
app.use("/api/comments", commentRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/status", companyStatusRouter);
app.use("/api/user", userRouter);

// Global 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log("Server running on port : ", PORT);
        })
    } catch (err) {
        console.error("Error in connecting server : ", err);
        process.exit(1);
    }
}

startServer();