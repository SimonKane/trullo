import express from "express";
import {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/taskControllers.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/tasks", getTasks);
router.post("/tasks", createTask);
router.get("/tasks/:id", getTaskById);
router.put("/tasks/:id", auth, updateTask);
router.delete("/tasks/:id", deleteTask);

export default router;
