import express, { json } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js'
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoutes.js';

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

app.use("/auth" ,authRouter);

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