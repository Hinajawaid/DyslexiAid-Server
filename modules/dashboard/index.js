import express from "express";
import { auth } from "../../middleware/auth.js";
import { adminAuth } from "../../middleware/adminAuth.js";
import userModel from "../user/user.model.js";
import resourcesModel from "../resources/resources.model.js";
import phonicsGameModel from "../phonicsGame/phonicsGame.model.js";

const router = express.Router();

// Store server start time
const serverStartTime = new Date();

router.get("/api/admin/dashboard/stats", auth, adminAuth, async (req, res) => {
    try {
      const userCount = await User.countDocuments();
      const contentCount = await Content.countDocuments();
      const gameDataCount = await GameData.countDocuments();
  
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