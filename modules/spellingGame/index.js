// spellingGame.route.js
import express from "express";
import fileUpload from "express-fileupload";
import { auth } from "../../middleware/auth.js";
import {
  saveSpellingData,
  getSpellingDataByLevel,
} from "./spellingGame.controller.js";

const router = express.Router();

// Configure express-fileupload middleware
router.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    createParentPath: true,
  })
);
router.post("/save", saveSpellingData);
router.get("/getData/:level", getSpellingDataByLevel);

export default router;
