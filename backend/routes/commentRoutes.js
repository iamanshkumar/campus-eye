import express from "express";
import { addComment, deleteComment, downvoteComment, getComments, upvoteComment } from "../controller/commentController.js";
import { protect } from "../middleware/authMiddleware.js";

const commentRouter = express.Router();

commentRouter.post("/",protect,addComment);
commentRouter.get("/:experienceId",getComments);
commentRouter.delete("/:commentId",protect,deleteComment);
commentRouter.put("/:id/upvote" , protect , upvoteComment);
commentRouter.put("/:id/downvote" , protect , downvoteComment);

export default commentRouter;