import express from "express";
import { auth } from "../../middleware/auth.js";
import {
  addPhonicsgameController,
  getPhonicsgameController,
} from "./phonics.controller.js";

const router = express.Router();

router.post("/addPhonicsGame", auth, addPhonicsgameController);
router.get("/getPhonicsGamebyId", auth, getPhonicsgameController);

export default router;
