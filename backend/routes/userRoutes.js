import express from 'express';
import { updateCheckList } from '../controller/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const userRouter = express.Router();

userRouter.put("/checklist" , protect , updateCheckList);

export default userRouter;