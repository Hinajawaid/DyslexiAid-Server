import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./modules/user/index.js";
import todoRouter from "./modules/planner/index.js";
import spellingGameRouter from "./modules/spellingGame/index.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from frontend
    methods: "POST",
    allowedHeaders: "Content-Type, Authorization",
  })
);
app.use("/user", userRouter);
app.use("/planner", todoRouter);
app.use("/spelling", spellingGameRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

const port = process.env.PORT || 3000;
const db_url = process.env.MONGODB_URL;

console.log(db_url);

mongoose
  .connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
