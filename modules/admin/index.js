import express from "express";
import {
  signUpController,
  loginController,
  logoutController,
  adminUpdateUser,
  adminDeleteUser,
  getAllUsers
} from "./admin.controller.js";
import multer from "multer";
import { adminAuth } from "../../middleware/adminAuth.js";
import { auth } from "../../middleware/auth.js";

// Define storage for the uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const router = express.Router();

//route to register user
router.post("/register", signUpController);

//route to login user
router.post("/login", loginController);

//route to logout
router.post("/logout",auth, logoutController);

router.get('/test', (req, res) => {
  res.json({ message: "Admin route works!" });
});
// Add these routes before export
router.get("/users", adminAuth, getAllUsers); // Get all users for admin
router.put("/users/:id", adminAuth, adminUpdateUser); // Admin update user
router.delete("/users/:id", adminAuth, adminDeleteUser); // Admin delete user
export default router;
