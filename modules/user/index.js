import express from "express";
import {
  signUpController,
  loginController,
  logoutController,
  googleSignInController,
  getUserInfo,
  updateUser,
  deleteUser,
  getUserProfile,
  // adminUpdateUser,
  // adminDeleteUser,
  getAllUsers,
} from "./user.controller.js";
import { auth } from "../../middleware/auth.js";
import multer from "multer";
// import { adminAuth } from "../../middleware/adminAuth.js";

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
router.get("/api/user", auth, getUserInfo);

//route to register user
router.post("/register", signUpController);

//route to login user
router.post("/login", loginController);

//route to logout
router.post("/logout", auth, logoutController);

router.post("/google", googleSignInController); // Add Google Sign-In route

router.get("/profile", auth, getUserProfile);

router.put("/update", auth, updateUser);

router.delete("/delete/:id", auth, deleteUser);

// Add these routes before export
// router.get("/admin/users", auth, adminAuth, getAllUsers); // Get all users for admin
// router.put("/admin/users/:id", auth, adminAuth, adminUpdateUser); // Admin update user
// router.delete("/admin/users/:id", auth, adminAuth, adminDeleteUser); // Admin delete user
export default router;
