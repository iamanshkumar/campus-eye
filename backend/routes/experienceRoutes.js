import { addExpereience , getAllExperience , deleteExperience , getExperience, upvoteExperience, downvoteExperience , getMyExperiences } from "../controller/experienceController.js";
import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const experienceRouter = express.Router();

experienceRouter.post("/" , protect , addExpereience);
experienceRouter.get("/" , getAllExperience);
experienceRouter.get("/me", protect, getMyExperiences);
experienceRouter.get("/:id" , getExperience);
experienceRouter.delete("/:id" , protect , deleteExperience);
experienceRouter.put("/:id/upvote" , protect , upvoteExperience);
experienceRouter.put("/:id/downvote" , protect , downvoteExperience);

export default experienceRouter;