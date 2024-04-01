import { Router } from "express";
import {
  getChallengesList,
  getChallengesById,
  addChallenge,
  updateChallenge,
  deleteChallenge,
} from "../controllers/challenges.controller";
import { checkChallenge } from "../middlewares/formatValidator.middleware";
import { pagination } from "../middlewares/pagination";

const router: Router = Router();

// completed crud for challenges model
router.get("/api/v1/challenges", pagination(10), getChallengesList);
router.get("/api/v1/challenge/:id", getChallengesById);
router.post("/api/v1/challenge", checkChallenge, addChallenge);
router.put("/api/v1/challenge/:id", checkChallenge, updateChallenge);
router.delete("/api/v1/challenge/:id", deleteChallenge);

export default router;
