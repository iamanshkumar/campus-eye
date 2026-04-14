import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/isAdmin.js';
import { upload } from '../middleware/multer.js';
import { addCompany , getAllCompanies , getCompany , updateCompany } from '../controller/companyController.js';

const companyRouter = express.Router();

companyRouter.post("/",protect , isAdmin , upload.single("logo") , addCompany);
companyRouter.get("/", protect, getAllCompanies);
companyRouter.get("/:id", protect, getCompany);
companyRouter.put("/:id", protect, isAdmin, upload.single('logo'), updateCompany);

export default companyRouter;