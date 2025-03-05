// spellingGame.route.js
import express from "express";
import { textToSpeech, saveDoc } from "./textToSpeech.controller.js";

const router = express.Router();

router.post("/tts", textToSpeech);
router.post("/saveDoc", saveDoc);

export default router;
