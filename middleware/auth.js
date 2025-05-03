import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    console.log("Received Token:", token);

    if (token) {
      token = token.split(" ")[1];
      console.log("Token after split:", token);
      console.log("Using Secret:", process.env.SECRET);

      let decode = jwt.verify(
        token,
        process.env.NODE_ENV === "production"
          ? process.env.PRODUCTION_SECRET
          : process.env.SECRET
      );
      console.log("Decoded Token:", decode);

      req.user = decode; // Store decoded user info in req.user
      console.log("Extracted User ID:", req.user?.id); // Corrected logging

      if (!req.user?.id) {
        console.log("No userId in token.");
        return res.status(401).json({ message: "Unauthenticated" });
      }

      next();
    } else {
      return res.status(401).json({ message: "Token missing" });
    }
  } catch (error) {
    console.log("Auth Middleware Error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};
