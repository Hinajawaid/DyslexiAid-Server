import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./user.model.js";
import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

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

//update budget service

export const updateUser = async (userId, age) => {
  try {
    const user = await User.findById(userId);
    if (!user) return { error: "User not found" };
    user.age = age;
    await user.save();
    return user;
  } catch (error) {
    return { error: true, message: error.message };
  }
};

// //get budget service
// export const getBudgetService = async (userId) => {
//   try {
//     const user = await User.findById(userId);
//     if (!user) return { error: "User not found" };
//     return user;
//   } catch (error) {
//     return { error: true, message: error.message };
//   }
// };