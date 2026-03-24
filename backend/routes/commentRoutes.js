import express from "express";
import { addComment, deleteComment, getComments } from "../controller/commentController.js";
import { protect } from "../middleware/authMiddleware.js";

const commentRouter = express.Router();

commentRouter.post("/",protect,addComment);
commentRouter.get("/:experienceId",getComments);
commentRouter.delete("/:commentId",protect,deleteComment);

export default commentRouter;