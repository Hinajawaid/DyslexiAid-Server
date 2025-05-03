// spellingGame.route.js
import express from "express";
import {
  textToSpeech,
  saveDoc,
  getSavedText,
  deleteTextFile,
} from "./textToSpeech.controller.js";

const router = express.Router();

router.post("/tts", textToSpeech);
router.post("/saveDoc", saveDoc);
router.get("/saved", getSavedText);
router.delete("/files/:fileId", deleteTextFile);
export default router;
