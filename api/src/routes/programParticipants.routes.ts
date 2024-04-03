import { Router } from "express";
import {
  getProgramParticipantsList,
  getProgramParticipantById,
  addProgramParticipant,
  updateProgramParticipant,
  deleteProgramParticipant,
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
  addProgramParticipant
);
router.put(
  "/api/v1/program-participant/:id",
  checkProgramParticipants,
  updateProgramParticipant
);
router.delete("/api/v1/program-participant/:id", deleteProgramParticipant);

export default router;
