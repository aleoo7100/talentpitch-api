import { Router } from "express";
import {
  getProgramsList,
  getProgramsById,
  addProgram,
  updateProgram,
  deleteProgram,
} from "../controllers/programs.controller";
import { checkProgram } from "../middlewares/formatValidator.middleware";
import { pagination } from "../middlewares/pagination";

const router: Router = Router();

// completed crud for programs model
router.get("/api/v1/programs", pagination(10), getProgramsList);
router.get("/api/v1/program/:id", getProgramsById);
router.post("/api/v1/program", checkProgram, addProgram);
router.put("/api/v1/program/:id", checkProgram, updateProgram);
router.delete("/api/v1/program/:id", deleteProgram);

export default router;
