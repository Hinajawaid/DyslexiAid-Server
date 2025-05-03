import express from "express";
import { auth } from "../../middleware/auth.js";
import { addgameController } from "./game.controller.js";

const router = express.Router();

router.post("/addGame", auth, addgameController);

export default router;
