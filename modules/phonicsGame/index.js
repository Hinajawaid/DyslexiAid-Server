// server/modules/phonics/index.js
import express from "express";
import fileUpload from "express-fileupload";
import {
  savePhonicsData,
  getPhonicsDataByLevel,
  getLetterData
} from "./phonicsGame.controller.js";

const router = express.Router();

router.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    createParentPath: true,
  })
);
router.post("/save", savePhonicsData);
router.get("/getData/:level", getPhonicsDataByLevel);
router.get("/letter/:letter", getLetterData);


export default router;