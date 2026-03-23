import express, { json } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js'
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoutes.js';
import companyRouter from "./routes/companyRoutes.js";
import experienceRouter from './routes/experienceRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use("/health" , (req,res)=>{
    res.json({
        success : true , 
        message : "Server is running"
    })
});

app.use("/api/auth" ,authRouter);
app.use("/api/companies",companyRouter);
app.use("/api/experiences" , experienceRouter);

const startServer = async()=>{
    try{
        await connectDB();
        app.listen(PORT,()=>{
            console.log("Server running on port : " , PORT);
        })    
    }catch(err){
        console.log("Error in connecting server : " , err);
    }
}

startServer();