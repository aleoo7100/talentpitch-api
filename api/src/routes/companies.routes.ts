import { Router } from "express";
import {
  getCompaniesList,
  getCompanyById,
  addCompany,
  updateCompany,
  deleteCompany,
} from "../controllers/companies.controller";
import { checkCompany } from "../middlewares/formatValidator.middleware";
import { pagination } from "../middlewares/pagination";

const router: Router = Router();

// completed crud for companies model
router.get("/api/v1/companies", pagination(10), getCompaniesList);
router.get("/api/v1/company/:id", getCompanyById);
router.post("/api/v1/company", checkCompany, addCompany);
router.put("/api/v1/company/:id", checkCompany, updateCompany);
router.delete("/api/v1/company/:id", deleteCompany);

export default router;
