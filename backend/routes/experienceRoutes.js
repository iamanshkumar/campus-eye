import { addExperience , getAllExperience , deleteExperience , getExperience, upvoteExperience, downvoteExperience , getMyExperiences, getExperiencesByStatus, approveExperience, rejectExperience } from "../controller/experienceController.js";
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { upload } from "../middleware/multer.js";

const experienceRouter = express.Router();

experienceRouter.post("/" , protect , addExperience);
experienceRouter.get("/" , getAllExperience);
experienceRouter.get("/me", protect, getMyExperiences);
experienceRouter.get("/admin/status", protect, isAdmin, getExperiencesByStatus);
experienceRouter.put("/:id/approve", protect, isAdmin, upload.single('logo'), approveExperience);
experienceRouter.put("/:id/reject", protect, isAdmin, rejectExperience);
experienceRouter.get("/:id" , getExperience);
experienceRouter.delete("/:id" , protect , deleteExperience);
experienceRouter.put("/:id/upvote" , protect , upvoteExperience);
experienceRouter.put("/:id/downvote" , protect , downvoteExperience);

export default experienceRouter;