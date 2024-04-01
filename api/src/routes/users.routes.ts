import { Router } from "express";
import {
  getUsersList,
  getUsersById,
  addUser,
  updateUser,
  deleteUser,
} from "../controllers/users.controller";
import { checkUser } from "../middlewares/formatValidator.middleware";
import { pagination } from "../middlewares/pagination";

const router: Router = Router();

// completed crud for users model
router.get("/api/v1/users", pagination(10), getUsersList);
router.get("/api/v1/user/:id", getUsersById);
router.post("/api/v1/user", checkUser, addUser);
router.put("/api/v1/user/:id", checkUser, updateUser);
router.delete("/api/v1/user/:id", deleteUser);

export default router;
