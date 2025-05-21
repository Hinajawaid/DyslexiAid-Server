import express from "express";
import { auth } from "../../middleware/auth.js";
import {
  saveSummary,
  getSummaries,
  deleteSummary,
} from "./summary.controller.js";

const router = express.Router();

router.post("/save", auth, saveSummary);
router.get("/getSummaries", auth, getSummaries);
router.delete("/deleteSummary/:id", auth, deleteSummary);

export default router;
