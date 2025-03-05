import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./user.model.js";
import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";


dotenv.config();

// Initialize Google OAuth2 client
const client = new OAuth2Client('395850754998-0sja28p7bcsdf0686euv44jcvfnjfenm.apps.googleusercontent.com'); // Replace with your Google Client ID

// Google Sign-In service
export const signUpWithGoogle = async (googleToken) => {
  try {
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: '395850754998-0sja28p7bcsdf0686euv44jcvfnjfenm.apps.googleusercontent.com', // Replace with your Google Client ID
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // Check if the user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user if they don't exist
      user = new User({
        name,
        email,
        profilePicture: picture, // Optional: Save the profile picture URL
        provider: 'google', // Indicate that the user signed up via Google
      });
      await user.save();
    }

    // Generate a JWT token for the user
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.SECRET
    );

    user.token = token;
    await user.save();

    return token;
  } catch (error) {
    return { error: true, message: error.message };
  }
};

//signup service
export const signUp = async (name, email, password) => {
  try {
    const oldUser = await User.findOne({ email });
    if (oldUser) return { error: "Email already Exists" };
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.SECRET
    );

    newUser.token = token;
    await newUser.save();

    return token;
  } catch (error) {
    return {
      error: true,
      message: error.message,
    };
  }
};

//login service

export const loginService = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) return { error: "Invalid Email or Password" };
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return { error: "Invalid Email or Password" };
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.SECRET
    );
    user.token = token;
    await user.save();
    return token;
  } catch (error) {
    return { error: true, message: error.message };
  }
};

// //update budget service

// export const updateUser = async (userId, age) => {
//   try {
//     const user = await User.findById(userId);
//     if (!user) return { error: "User not found" };
//     user.age = age;
//     await user.save();
//     return user;
//   } catch (error) {
//     return { error: true, message: error.message };
//   }
// };

export const fetchInfo = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { status: false, message: "User not found" };
    }
    return { status: true, user };
  } catch (error) {
    console.error("Error fetching user info:", error);
    return { status: false, message: "Server error" };
  }
};


export const findUserById = async (userId) => {
  return await User.findById(userId).select("-password");
};

export const updateUserDetails = async (userId, name, email, age, currentPassword, newPassword, profilePicture) => {
  const user = await User.findById(userId);
  if (!user) return { status: false, message: "User not found" };

  user.name = name || user.name;
  user.email = email || user.email;
  user.age = age || user.age;
  user.profilePicture = profilePicture || user.profilePicture;


  if (currentPassword && newPassword) {
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return { status: false, message: "Incorrect current password" };

    user.password = await bcrypt.hash(newPassword, 10);
  }

  await user.save();
  return { status: true, message: "Profile updated successfully" };
};

export const deleteUserById = async (userId) => {
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return { status: false, message: "User not found" };
    }
    return { status: true, message: "Account deleted successfully" };
  } catch (error) {
    console.error("Delete user error:", error);
    return { status: false, message: "Server error" };
  }
};

// user.service.js
export const logoutService = async (userId) => {
  try {
    // Perform any necessary cleanup (e.g., invalidate token, clear sessions, etc.)
    // For now, we'll just return a success message
    return { status: true, message: "Logged out successfully" };
  } catch (error) {
    console.error("Logout error:", error);
    return { status: false, message: "Server error" };
  }
};
