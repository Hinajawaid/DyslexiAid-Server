import {
    signUp,
    loginService,
    updateUser,
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
  
  //update budget
  export const updateUserController = async (req, res) => {
    const { age } = req.body;
    try {
      const updatedUser = await updateUser(req.userId, age);
      return res
        .status(200)
        .json({ message: "Age updated successfully", updatedUser });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  };
  
  //logout controller
  export const logoutController = async (req, res) => {
    try {
      return res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Error logging out" });
    }
  };
  
//   //get budget controller
//   export const getBudgetController = async (req, res) => {
//     const userId = req.userId;
//     try {
//       const budget = await getBudgetService(userId);
//       if (budget.error) {
//         return res.status(400).json({ message: budget.message });
//       }
//       res.status(200).json(budget);
//     } catch (error) {
//       return res.status(500).json({ message: "Error getting budget" });
//     }
//   };