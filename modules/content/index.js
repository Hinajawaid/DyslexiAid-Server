import express from 'express';
import {
  createContent,
  getContents,
  getContent,
  updateContent,
  deleteContent,
  getContentsByCategory
} from './content.controller.js';
import { auth } from '../../middleware/auth.js';
import upload from '../../middleware/upload.js';

const router = express.Router();

router.post('/', auth, upload.single('image'), createContent);
router.get('/', getContents);
router.get('/:id', getContent);
router.put('/:id', auth, upload.single('image'), updateContent);
router.delete('/:id', auth, deleteContent);
router.get('/category/:category', getContentsByCategory);

export default router;