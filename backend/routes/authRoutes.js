import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { register , login , logout } from '../controller/authController.js';

const authRouter = express.Router();

authRouter.post("/register" , register);
authRouter.post("/login" , login);
authRouter.get("/profile" , protect , (req,res)=>{
    res.json({
        success : true , 
        user : req.user
    });
})

authRouter.post("/logout" , protect , logout);

export default authRouter;