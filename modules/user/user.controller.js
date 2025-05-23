import {
  signUp,
  loginService,
  googleSignInService,
  fetchInfo,
  findUserById,
  updateUserDetails,
  deleteUserById,
  logoutService,
} from "./user.service.js";

import { OAuth2Client } from "google-auth-library";
import User from "./user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

export const googleSignInController = async (req, res) => {
  const { token } = req.body;
  try {
    const authToken = await googleSignInService(token);
    if (authToken.error) {
      return res.status(400).json({ error: true, message: authToken.message });
    }

    // Find user to include in response
    const decoded = jwt.verify(authToken, process.env.SECRET);
    const user = await User.findById(decoded.id).select('name email _id');

    return res.status(200).json({
      success: true,
      token: authToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Google Sign-In Controller Error:", error);
    return res.status(500).json({ error: true, message: "Server error during Google Sign-In" });
  }
};


//unified and working
export const signUpController = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const result = await signUp(name, email, password);

    if (result.error) {
      return res.status(400).json({
        error: true,
        message: result.message,
      });
    }

    // Unified response format
    return res.status(201).json({
      success: true,
      token: result.token,
      user: {
        _id: result.user._id,
        name: result.user.name,
        email: result.user.email,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

  //login controller
  
  export const loginController = async (req, res) => {
    console.log("Login endpoint hit:", req.body);  // Add this log

  const { email, password } = req.body;
  try {
    const token = await loginService(email, password);
    if (token.error) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    return res
      .status(200)
      .json({ message: "User logged in successfully", token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getUserInfo = async (req, res) => {
  try {
    console.log("Received request for user info");
    const user = await User.findById(req.user.id);
    console.log("Fetching user info for ID:", user);

    if (!user) {
      return res
        .status(401)
        .json({ status: false, message: "Unauthenticated" });
    }
    console.log("User found:", user);

    const response = await fetchInfo(user);
    res.status(200).json(response);
  } catch (error) {
    console.error("Get user info error:", error);
    res.status(400).json({ status: false, message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    console.log("Received request for user info");
    const user = await User.findById(req.user.id);
    console.log("Fetching user info for ID:", user);

    if (!user) {
      return res
        .status(401)
        .json({ status: false, message: "Unauthenticated" });
    }
    console.log("User found:", user);

    const response = await fetchInfo(user);
    res.status(200).json(response);
  } catch (error) {
    console.error("Get user info error:", error);
    res.status(400).json({ status: false, message: error.message });
  }
};

export const updateUser = async (req, res) => {
  console.log("Received update request:", req.body);
  console.log("User ID from token:", req.user?.id);

  try {
    const { name, email, age, currentPassword, newPassword, profilePicture } =
      req.body;
    console.log("Update data received:", {
      name,
      email,
      age,
      currentPassword,
      newPassword,
      profilePicture,
    });

    const result = await updateUserDetails(
      req.user.id,
      name,
      email,
      age,
      currentPassword,
      newPassword,
      profilePicture
    );

    if (!result.status) {
      console.log("Update failed:", result);
      return res.status(400).json(result);
    }
    console.log("Update successful:", result);

    res.json(result);
  } catch (error) {
    console.log("Update Error:", error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    console.log("Received delete request for user ID:", req.params.id);
    const result = await deleteUserById(req.params.id);
    if (!result.status) {
      console.log("Delete failed:", result);
      return res.status(400).json(result);
    }

    console.log("Delete successful:", result);
    res.json(result);
  } catch (error) {
    console.log("Delete Error:", error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

export const logoutController = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from the token
    const result = await logoutService(userId);

    if (!result.status) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

export const updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ status: false, message: "No profile picture provided" });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: imageUrl },
      { new: true }
    );

    res
      .status(200)
      .json({
        status: true,
        message: "Profile picture updated",
        user: updatedUser,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        status: false,
        message: "Error updating profile picture",
        error: error.message,
      });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -token");
    res.status(200).json({ status: true, users });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(400).json({ status: false, message: error.message });
  }
};

export const adminUpdateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, age, profilePicture } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, age, profilePicture },
      { new: true }
    ).select("-password -token");

    if (!updatedUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    res.status(200).json({ status: true, user: updatedUser });
  } catch (error) {
    console.error("Admin update user error:", error);
    res.status(400).json({ status: false, message: error.message });
  }
};

export const adminDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ status: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Admin delete user error:", error);
    res.status(400).json({ status: false, message: error.message });
  }
};
