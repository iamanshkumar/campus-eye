import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/isAdmin.js';
import { addCompany , getAllCompanies , getCompany , updateCompany } from '../controller/companyController.js';

const companyRouter = express.Router();

companyRouter.post("/",protect , isAdmin , addCompany);
companyRouter.get("/", protect, getAllCompanies);
companyRouter.get("/:id", protect, getCompany);
companyRouter.put("/:id", protect, isAdmin, updateCompany);

export default companyRouter;