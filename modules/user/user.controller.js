import {
    signUp,
    loginService,
    signUpWithGoogle, 
    fetchInfo, 
    findUserById,
    updateUserDetails, 
    deleteUserById,
    logoutService
  } from "./user.service.js";
  
import { OAuth2Client } from 'google-auth-library';
import User from './user.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the OAuth2Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google Sign-In Controller
export const googleSignInController = async (req, res) => {
  console.log("Received request to /user/google");

  console.log("Received headers:", req.headers);  // Log headers to check if authorization is present
  console.log("Received request to /user/google", req.body);
  console.log("Request body: ", req.body); // Log the request body
  try {
    const { id_token } = req.body;

    // Log the incoming id_token
    console.log('Received id_token:', id_token);

    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID, // Ensure this matches the client ID
    });

    // Log the payload after verifying the token
    const payload = ticket.getPayload();
    console.log('Verified Payload:', payload);

    const userId = payload['sub']; // Google user ID

    // Check if the user exists in your database
    let user = await User.findOne({ googleId: userId });
    if (!user) {
      // Log if creating a new user
      console.log('User not found. Creating new user...');
      user = new User({
        name: payload.name,
        email: payload.email,
        googleId: userId,
        picture: payload.picture,
      });
      await user.save();
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ email: user.email, id: user._id }, process.env.SECRET);

    res.status(200).json({ message: 'User logged in successfully', token, user });
  } catch (error) {
    console.error('Error in Google Sign-In:', error);
    res.status(400).json({ message: 'Invalid Google token' });
  }
};


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
    const { email, password } = req.body;
    try {
      const token = await loginService(email, password);
      if (token.error) {
        return res.status(400).json({ message: token.message });
      }
      return res
        .status(200)
        .json({ message: "User logged in successfully", token });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  };
  
  // //update budget
  // export const updateUserController = async (req, res) => {
  //   const { age } = req.body;
  //   try {
  //     const updatedUser = await updateUser(req.userId, age);
  //     return res
  //       .status(200)
  //       .json({ message: "Age updated successfully", updatedUser });
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(500).json({ message: error.message });
  //   }
  // };
  
  // //logout controller
  // export const logoutController = async (req, res) => {
  //   try {
  //     return res.status(200).json({ message: "User logged out successfully" });
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(500).json({ message: "Error logging out" });
  //   }
  // };

  export const getUserInfo = async (req, res) => {
    try {
      console.log("Received request for user info");
      const user = await User.findById(req.user.id);
      console.log("Fetching user info for ID:", user);

      if (!user) {
        return res.status(401).json({ status: false, message: "Unauthenticated" });
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
        return res.status(401).json({ status: false, message: "Unauthenticated" });
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
      const { name, email, age, currentPassword, newPassword, profilePicture } = req.body;
      console.log("Update data received:", { name, email, age, currentPassword, newPassword, profilePicture });
      
      const result = await updateUserDetails(req.user.id, name, email, age, currentPassword, newPassword, profilePicture);

      if (!result.status){ 
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
        return res.status(400).json({ status: false, message: "No profile picture provided" });
      }
  
      const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { profilePicture: imageUrl },
        { new: true }
      );
  
      res.status(200).json({ status: true, message: "Profile picture updated", user: updatedUser });
    } catch (error) {
      res.status(500).json({ status: false, message: "Error updating profile picture", error: error.message });
    }
  };
  