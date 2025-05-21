import express from "express";
import {
  signUpController,
  loginController,
  logoutController,
  adminUpdateUser,
  adminDeleteUser,
  getAllUsers, 
  update_credentials
} from "./admin.controller.js";
import multer from "multer";
import { adminAuth } from "../../middleware/adminAuth.js";
import { auth } from "../../middleware/auth.js";
import User from "../user/user.model.js";
import Resource from "../resources/resources.model.js";
import phonicsGame from "../phonicsGame/phonicsGame.model.js";

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
router.post("/logout",adminAuth, logoutController);

// Add these routes before export
router.get("/users", adminAuth, getAllUsers); // Get all users for admin
router.put("/users/:id", adminAuth, adminUpdateUser); // Admin update user
router.delete("/users/:id", adminAuth, adminDeleteUser); // Admin delete user
router.put("/update-credentials", adminAuth, update_credentials); // Update user credentials


// Store server start time
const serverStartTime = new Date();

router.get("/stats", auth, adminAuth, async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const contentCount = await Resource.countDocuments();
    const gameDataCount = await phonicsGame.countDocuments();

    // Calculate uptime
    const currentTime = new Date();
    const uptimeSeconds = Math.floor((currentTime - serverStartTime) / 1000);
    const uptimePercentage = calculateUptimePercentage(uptimeSeconds);

    res.status(200).json({
      status: true,
      data: {
        activeUsers: userCount,
        newContent: contentCount,
        gameSessions: gameDataCount,
        uptime: uptimePercentage.toFixed(1) + "%",
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ status: false, message: "Server error" });
  }
});

// Simple uptime calculation (assumes no downtime for simplicity)
function calculateUptimePercentage(uptimeSeconds) {
  // For demo, assume server should be up since start time
  // In production, use a monitoring service or track actual downtime
  const totalPossibleUptime = uptimeSeconds; // Total seconds since start
  return (uptimeSeconds / totalPossibleUptime) * 100; // Always 100% unless downtime tracked
}


export default router;
