import express from "express";
import authMiddleware from "../middleware/auth.js";

import {
  addTask,
  findTask,
  findTaskById,
  updateTask,
  deleteTask,
  dashboard
} from "../controller/task.js";

export const taskRouter = express.Router();

taskRouter.post("/", authMiddleware, addTask);

taskRouter.get("/", authMiddleware, findTask);
taskRouter.get("/dashboard", authMiddleware, dashboard);
taskRouter.get("/:id", authMiddleware, findTaskById);

taskRouter.put("/:id", authMiddleware, updateTask);

taskRouter.delete("/:id", authMiddleware, deleteTask);

