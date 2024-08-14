import {
    signUp,
    loginService,
    updateUser,
  } from "./user.service.js";
  
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