import express from "express";
import { auth } from "../../middleware/auth.js";
import { addgameController, getgameController } from "./game.controller.js";

const router = express.Router();

router.post("/addGame", auth, addgameController);
router.get("/getGamebyId", auth, getgameController);

export default router;
