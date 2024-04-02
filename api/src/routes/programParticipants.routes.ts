import { Router } from "express";
import {
  getProgramParticipantsList,
  getProgramParticipantById,
  addChallenge,
  updateChallenge,
  deleteChallenge,
} from "../controllers/programParticipants.controller";
import { checkProgramParticipants } from "../middlewares/formatValidator.middleware";
import { pagination } from "../middlewares/pagination";

const router: Router = Router();

// completed crud for programParticipants model
router.get(
  "/api/v1/program-participants",
  pagination(10),
  getProgramParticipantsList
);
router.get("/api/v1/program-participant/:id", getProgramParticipantById);
router.post(
  "/api/v1/program-participant",
  checkProgramParticipants,
  addChallenge
);
router.put(
  "/api/v1/program-participant/:id",
  checkProgramParticipants,
  updateChallenge
);
router.delete("/api/v1/program-participant/:id", deleteChallenge);

export default router;
