import { addExpereience , getAllExperience , deleteExperience , getExperience } from "../controller/experienceController.js";
import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const experienceRouter = express.Router();

experienceRouter.post("/" , protect , addExpereience);
experienceRouter.get("/" , getAllExperience);
experienceRouter.get("/:id" , getExperience);
experienceRouter.delete("/:id" , protect , deleteExperience);

export default experienceRouter;