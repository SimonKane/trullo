import express from "express";
import {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  resetPassword,
} from "../controllers/userControllers.js";
import { login } from "../controllers/authController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", login);
router.get("/users", getUsers);
router.post("/users", createUser);
router.post("/users/:id/reset-password", auth, resetPassword);
router.get("/users/:id", getUserById);
router.put("/users/:id", auth, updateUser);
router.delete("/users/:id", deleteUser);

export default router;
