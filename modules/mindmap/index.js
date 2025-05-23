import express from "express";
const router = express.Router();
import { getMindmaps, deleteMindmap, saveMindmap, generateMindMap } from "./controller.js"; 
import { auth } from "../../middleware/auth.js";

router.post('/generate-mind-map', generateMindMap);
router.post('/save', auth, saveMindmap);
router.get('/getMindmaps', auth, getMindmaps);
router.delete('/deleteMindmap/:id', auth, deleteMindmap);

export default router;