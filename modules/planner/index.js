import express from "express";
import { auth } from "../../middleware/auth.js";
import { getTodoController, createTodoController, markTodoCompleteController, markTodoDeleteController } from "./planner.controller.js";

const router = express.Router();

//get todo controller
router.get("/gettask", auth,getTodoController);

router.post("/addtask",auth, createTodoController);

router.patch("/:taskId", auth,markTodoCompleteController);

router.delete("/:taskId",auth, markTodoDeleteController);

export default router;
