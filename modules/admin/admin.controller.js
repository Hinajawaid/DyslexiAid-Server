import {
  signUp,
  loginService,
  logoutService,
  updateAdminDetails,
} from "./admin.service.js";

import Admin from "./admin.model.js";
import dotenv from "dotenv";
import User from "../user/user.model.js";
import mongoose from "mongoose";

dotenv.config();

//signup controller
export const signUpController = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const token = await signUp(name, email, password);
    if (token.error) {
      return res.status(400).json({ message: token.message });
    }
    return res
      .status(200)
      .json({ message: "User created successfully", token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

//login controller

export const loginController = async (req, res) => {
  console.log("Login endpoint hit:", req.body); // Add this log

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

export const getAllUsers = async (req, res) => {
  try {
    console.log("Admin users route hit");
    console.log("Authenticated user:", req.user);
    const users = await User.find().select("-password -token");
    console.log(`Found ${users.length} users`);

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
  console.log('DELETE request received for user:', req.params.id);
console.log('Authorization header:', req.headers.authorization);
  try {
    const { id } = req.params;
    
    console.log(`Attempting to delete user with ID: ${id}`);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: "Invalid user ID" });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      console.log(`User not found with ID: ${id}`);
      return res.status(404).json({ 
        status: false, 
        message: "User not found" 
      });
    }
    
    console.log(`Successfully deleted user: ${deletedUser.email}`);
    res.status(200).json({ 
      status: true, 
      message: "User deleted successfully",
      deletedUserId: id 
    });
  } catch (error) {
    console.error("Admin delete user error:", error);
    res.status(500).json({ 
      status: false, 
      message: "Server error during deletion",
      error: error.message 
    });
  }
};

export const update_credentials = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;
  try {
    const result = await updateAdminDetails(
      userId,
      currentPassword,
      newPassword
    );
    console.log("updateAdminDetails result:", result); // Debug log
    if (!result.status) {
      return res.status(400).json({ message: result.message });
    }
    return res.status(200).json({ message: result.message });
  } catch (error) {
    console.error("Update credentials error:", error);
    return res.status(500).json({ message: error.message });
  }
};
