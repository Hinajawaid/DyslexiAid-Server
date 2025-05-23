import express from 'express';
import { savePhonicsData, getDataGame, getPhonicsDataByLevel, getLetterData, deleteWord, updateWord, deleteLevel, getLevels, updateLevel } from './phonicsGame.controller.js';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// Routes for phonics game
router.post('/save', upload.fields([{ name: 'audioFiles' }]), savePhonicsData);
router.get('/getData/:level', getPhonicsDataByLevel);
router.get('/getDataGame/:level', getDataGame);
router.get('/letter/:letter', getLetterData);
router.delete('/deleteWord/:id/:wordIndex', deleteWord);
router.put('/updateWord/:id/:wordIndex', upload.single('audioFile'), updateWord);
router.delete('/deleteLevel/:id', deleteLevel);
router.get('/levels', getLevels);
router.post('/updateLevel', upload.fields([{ name: 'audioFiles' }]), updateLevel);

export default router;