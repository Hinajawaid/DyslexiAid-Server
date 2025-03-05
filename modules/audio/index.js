import express from "express";
import multer from "multer";
import { transcribeAudio, saveTranscription, getSavedTranscriptions, deleteFile } from "./controller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Handle file upload
router.post("/upload", upload.single("file"), transcribeAudio);
router.post("/save", saveTranscription);
router.get("/saved", getSavedTranscriptions);
router.delete("/files/:fileId", deleteFile);
console.log("POST /audio/upload route registered");


export default router;