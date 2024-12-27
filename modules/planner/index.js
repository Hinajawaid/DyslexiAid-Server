import express from "express";
import { auth } from "../../middleware/auth.js";
import { getTodoController, createTodoController, markTodoCompleteController, markTodoDeleteController } from "./planner.controller.js";

const router = express.Router();

//get todo controller
router.get("/", getTodoController);

router.post("/", createTodoController);

router.patch("/:taskId", markTodoCompleteController);

router.delete("/:taskId", markTodoDeleteController);

export default router;
