import express from "express";
import { auth } from "../../middleware/auth.js";
import upload from '../../middleware/upload.js';
import {
  getResourcesController,
  createContent,
  getContents,
  getContent,
  updateContent,
  deleteContent,
} from "./resources.controller.js";

const router = express.Router();

router.post("/by-heading", getResourcesController);
router.post("/", auth, upload.single("image"), createContent);
router.get("/", getContents);
router.get("/:id", getContent);
router.put("/:id", auth, upload.single("image"), updateContent);
router.delete("/:id", auth, deleteContent);

export default router;