import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "./admin.model.js";
import dotenv from "dotenv";

dotenv.config();

//signup service
export const signUp = async (name, email, password) => {
  try {
    const oldUser = await Admin.findOne({ email });
    if (oldUser) return { error: true, message: "Email already Exists" };

    // if (oldUser) return { error: "Email already Exists" };
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Original Password:", password);
console.log("Hashed Password:", hashedPassword);

    const newUser = new Admin({
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
  console.log(`Checking user for email: ${email}`); // Log email check

  try {
    const user = await Admin.findOne({ email });
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

// user.service.js
export const logoutService = async (userId) => {
  try {
    const user = await Admin.findById(userId);
    if (!user) {
      return { status: false, message: "User not found" };
    }
    user.token = null;
    await user.save();
    return { status: true, message: "Logged out successfully" };
  } catch (error) {
    console.error("Logout error:", error);
    return { status: false, message: "Server error" };
  }
};

export const updateAdminDetails = async (
  userId,
  currentPassword,
  newPassword,
) => {
  const user = await Admin.findById(userId);
  if (!user) return { status: false, message: "User not found" };

  if (currentPassword && newPassword) {
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return { status: false, message: "Incorrect current password" };

    user.password = await bcrypt.hash(newPassword, 10);
  }

  await user.save();
  return { status: true, message: "Profile updated successfully" };
};
