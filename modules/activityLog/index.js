import express from "express";
import { auth } from "../../middleware/auth.js";
import { getactivityLogController } from "./activityLog.controller.js";

const router = express.Router();

router.get("/getActivityLog", auth, getactivityLogController);

export default router;
