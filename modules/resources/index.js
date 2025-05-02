import express from "express";
// import { auth } from "../../middleware/auth.js";
import { getResourcesController } from "./resources.controller.js";

const router = express.Router();

//get todo controller
router.post("/", getResourcesController);

export default router;
