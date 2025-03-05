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
} from "./user.controller.js";
import { auth } from "../../middleware/auth.js";
import multer from "multer";

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

// router.put("/user/updateProfilePicture", auth, upload.single("profilePicture"), updateProfilePicture);

const router = express.Router();
router.get("/api/user", auth, getUserInfo);

//route to register user
router.post("/register", signUpController);

//route to login user
router.post("/login", loginController);

//route to logout
router.post("/logout",auth, logoutController);

router.post("/google", googleSignInController); // Add Google Sign-In route

router.get("/profile", auth, getUserProfile);

router.put("/update", auth, updateUser);

router.delete("/delete/:id", auth, deleteUser);

export default router;
