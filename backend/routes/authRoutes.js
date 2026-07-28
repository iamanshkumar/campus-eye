import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { register , login , logout , forgetPassword , resetPassword } from '../controller/authController.js';
import { authRateLimiter, otpRateLimiter } from '../middleware/rateLimiter.js';

const authRouter = express.Router();

authRouter.post("/register" , authRateLimiter , register);
authRouter.post("/login" , authRateLimiter , login);
authRouter.get("/profile" , protect , (req,res)=>{
    res.json({
        success : true , 
        user : req.user
    });
})

authRouter.post("/logout" , protect , logout);

authRouter.post("/forget-password" , otpRateLimiter , forgetPassword);
authRouter.post("/reset-password" , otpRateLimiter , resetPassword);

export default authRouter;