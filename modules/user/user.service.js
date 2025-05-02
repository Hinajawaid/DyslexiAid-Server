import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./user.model.js";
import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleSignInService = async (googleToken) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        profilePicture: picture,
        googleId: payload.sub,
      });
      await user.save();
    }

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

// //before admin
// //signup service
// export const signUp = async (name, email, password) => {
//   try {
//     const oldUser = await User.findOne({ email });
//     if (oldUser) return { error: true, message: "Email already Exists" };

//     // if (oldUser) return { error: "Email already Exists" };
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
//     console.log("Original Password:", password);
// console.log("Hashed Password:", hashedPassword);

//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//     });
//     await newUser.save();

//     const token = jwt.sign(
//       { email: newUser.email, id: newUser._id },
//       process.env.SECRET
//     );

//     newUser.token = token;
//     await newUser.save();

//     return token;
//   } catch (error) {
//     return {
//       error: true,
//       message: error.message,
//     };
//   }
// };


//works admin
// export const signUp = async (name, email, password) => {
//   try {
//     const oldUser = await User.findOne({ email });
//     if (oldUser) return { error: true, message: "Email already Exists" };

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     await newUser.save();

//     const token = jwt.sign(
//       { email: newUser.email, id: newUser._id },
//       process.env.SECRET
//     );

//     newUser.token = token;
//     await newUser.save();

//     // Return both token and user data
//     return {
//       token,
//       user: {
//         _id: newUser._id,
//         name: newUser.name,
//         email: newUser.email,
//         // Add other fields as needed
//       }
//     };
//   } catch (error) {
//     return {
//       error: true,
//       message: error.message,
//     };
//   }
// };

//unified and working
export const signUp = async (name, email, password) => {
  try {
    const oldUser = await User.findOne({ email });
    if (oldUser) return { 
      error: true, 
      message: "Email already Exists" 
    };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Original Password:", password);
    console.log("Hashed Password:", hashedPassword);

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

    return {
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    };
  } catch (error) {
    return {
      error: true,
      message: error.message,
    };
  }
};

// export const signUp = async (name, email, password) => {
//   try {
//     const oldUser = await User.findOne({ email });
//     if (oldUser) return { error: true, message: "Email already Exists" };

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     await newUser.save();

//     const token = jwt.sign(
//       { email: newUser.email, id: newUser._id },
//       process.env.SECRET
//     );

//     newUser.token = token;
//     await newUser.save();

//     // Return both token and user data
//     return {
//       token,
//       user: {
//         _id: newUser._id,
//         name: newUser.name,
//         email: newUser.email,
//         // Add other fields as needed
//       }
//     };
//   } catch (error) {
//     return {
//       error: true,
//       message: error.message,
//     };
//   }
// };

//login service

export const loginService = async (email, password) => {
  console.log(`Checking user for email: ${email}`); // Log email check

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return { error: true };
    }

    console.log(`User found: ${user.email}`); // Confirm user data
    try {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log("Entered Password:", password);  // Raw password entered
console.log("Stored Hashed Password:", user.password); // Password from database

      console.log("Password Match Result:", isPasswordValid);
    
      if (!isPasswordValid) {
        console.log("Invalid password");
        return { error: true };
      }
    } catch (error) {
      console.error("Password comparison error:", error);
      return { error: true };
    }
    

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

export const updateUserDetails = async (
  userId,
  name,
  email,
  age,
  currentPassword,
  newPassword,
  profilePicture
) => {
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
