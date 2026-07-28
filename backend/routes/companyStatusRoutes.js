import express from "express";
import { getAllTargetingCompanies, removeCompanyStatus, targetCompany, updateCompanyStatus } from "../controller/companyStatusController.js";
import { protect } from "../middleware/authMiddleware.js";

const companyStatusRouter = express.Router();

companyStatusRouter.post("/" , protect , targetCompany);
companyStatusRouter.get("/" , protect , getAllTargetingCompanies);
companyStatusRouter.put("/:companyId" , protect , updateCompanyStatus);
companyStatusRouter.delete("/:companyId" , protect , removeCompanyStatus);

export default companyStatusRouter;