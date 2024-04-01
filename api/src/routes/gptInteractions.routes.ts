import { Router } from "express";
import { insertDummyData } from "../controllers/gptInteractions.controller";

const router: Router = Router();

// route to fill the database with dummy data
router.get("/api/v1/fill-db", insertDummyData);

export default router;
