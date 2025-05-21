import express from 'express';
import { savespellingData, getDataGame, getspellingDataByLevel, getLetterData, deleteWord, updateWord, deleteLevel, getLevels, updateLevel } from './spellingGame.controller.js';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// Routes for spelling game
router.post('/save', upload.fields([{ name: 'audioFiles' }]), savespellingData);
router.get('/getData/:level', getspellingDataByLevel);
router.get('/getDataGame/:level', getDataGame);
router.get('/letter/:letter', getLetterData);
router.delete('/deleteWord/:id/:wordIndex', deleteWord);
router.put('/updateWord/:id/:wordIndex', upload.single('audioFile'), updateWord);
router.delete('/deleteLevel/:id', deleteLevel);
router.get('/levels', getLevels);
router.post('/updateLevel', upload.fields([{ name: 'audioFiles' }]), updateLevel);

export default router;