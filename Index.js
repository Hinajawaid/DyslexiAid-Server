import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./modules/user/index.js";
import todoRouter from "./modules/planner/index.js";
import spellingGameRouter from "./modules/spellingGame/index.js";
import phonicsRoutes from "./modules/phonicsGame/index.js";
import audioRoutes from "./modules/audio/index.js";
import axios from "axios";
import bodyParser from "body-parser";

import textToSpeechRouter from "./modules/textToSpeech/index.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*", // Allow requests from frontend
    methods: "GET,POST",
    allowedHeaders: "Content-Type, Authorization",
  })
);
app.use("/user", userRouter);
app.use("/planner", todoRouter);
app.use("/spelling", spellingGameRouter);
app.use("/phonics", phonicsRoutes);
app.use("/audio", audioRoutes);
console.log("Audio routes mounted at /audio");
app.use(bodyParser.json());

app.use("/textToSpeech", textToSpeechRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

async function testFastAPI() {
  try {
    const response = await axios.get("http://172.20.5.197:4000/");
    console.log(response.data);
  } catch (error) {
    console.error("Error connecting to FastAPI:", error.message);
  }
}

testFastAPI();

const port = process.env.PORT || 4000;
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

// mongoose
//   .connect(db_url)
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("MongoDB connection error:", err));
