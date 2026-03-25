import express from 'express';
import { updateCheckList, updateProfile } from '../controller/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const userRouter = express.Router();

userRouter.put("/checklist" , protect , updateCheckList);
userRouter.put("/profile" , protect , updateProfile);

export default userRouter;