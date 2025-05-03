// import polly from "./awsConfig.js";
// // const polly = require("./awsConfig");

// export const textToSpeech = async (req, res) => {
//   try {
//     const { text } = req.body;

//     if (!text) {
//       return res.status(400).json({ error: "Text is required for synthesis" });
//     }

//     const params = {
//       Text: text,
//       OutputFormat: "mp3", // Options: mp3, ogg_vorbis, pcm
//       VoiceId: "Joanna", // Choose a Polly voice (Joanna, Matthew, etc.)
//     };

//     const data = await polly.synthesizeSpeech(params).promise();

//     res.set({
//       "Content-Type": "audio/mpeg",
//       "Content-Disposition": 'attachment; filename="speech.mp3"',
//     });

//     res.send(data.AudioStream);
//   } catch (error) {
//     console.error("Polly error:", error);
//     res.status(500).json({ error: "Error generating speech" });
//   }
// };
import polly from "./awsConfig.js";
import { SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import TextDocument from "./textToSpeech.model.js";
import mongoose from "mongoose";

export const textToSpeech = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required for synthesis" });
    }

    // First request: Get the audio
    const audioParams = {
      Text: text,
      OutputFormat: "mp3",
      VoiceId: "Joanna",
    };

    const audioCommand = new SynthesizeSpeechCommand(audioParams);
    const audioData = await polly.send(audioCommand);

    // Second request: Get the speech marks
    const speechMarksParams = {
      Text: text,
      OutputFormat: "json",
      VoiceId: "Joanna",
      SpeechMarkTypes: ["word"], // Get word-level timing marks
    };

    const speechMarksCommand = new SynthesizeSpeechCommand(speechMarksParams);
    const speechMarksData = await polly.send(speechMarksCommand);

    // Convert the audio stream to a buffer
    const audioBuffer = Buffer.from(
      await audioData.AudioStream.transformToByteArray()
    );

    // Convert speech marks to string and parse
    const speechMarksBuffer = Buffer.from(
      await speechMarksData.AudioStream.transformToByteArray()
    );
    const speechMarksString = speechMarksBuffer.toString();

    // Parse the speech marks (each line is a JSON object)
    const speechMarks = speechMarksString
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => JSON.parse(line));

    // Return both audio and speech marks in the response
    res.json({
      audio: audioBuffer.toString("base64"),
      speechMarks: speechMarks,
    });
  } catch (error) {
    console.error("Polly error:", error);
    res.status(500).json({ error: "Error generating speech" });
  }
};

export const saveDoc = async (req, res) => {
  console.log("inside savedoc");
  try {
    const { title, content } = req.body;
    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required fields",
      });
    }

    const newDoc = new TextDocument({ title, content });
    const docSaved = await newDoc.save();
    res.status(201).json({
      success: true,
      message: "Document saved successfully",
      document: {
        id: docSaved._id,
        title: docSaved.title,
        createdAt: docSaved.createdAt,
      },
    });
  } catch (error) {
    console.error("Error saving document:", error);
    res.status(500).json({ error: "Error saving document" });
  }
};

export const getSavedText = async (req, res) => {
  try {
    const textDoc = await TextDocument.find();
    res.json(textDoc);
  } catch (error) {
    console.error("Error fetching transcriptions:", error);
    res.status(500).json({ error: "Failed to fetch transcriptions" });
  }
};

export const deleteTextFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    console.log(`Received request to delete file with ID: ${fileId}`);

    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      console.log("❌ Invalid ObjectId format");
      return res.status(400).json({ error: "Invalid file ID" });
    }

    const file = await TextDocument.findById(fileId);
    if (!file) {
      console.log("File not found in database");
      return res.status(404).json({ error: "File not found" });
    }

    console.log("Deleting files:", file.title, file.content);

    // // Ensure files exist before deleting
    // if (fs.existsSync(file.filePath)) fs.unlinkSync(file.filePath);
    // if (fs.existsSync(file.pdfPath)) fs.unlinkSync(file.pdfPath);

    await TextDocument.findByIdAndDelete(fileId); // Remove from DB
    console.log("File deleted successfully");

    res.json({ success: true, message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error); // Log detailed error
    res
      .status(500)
      .json({ error: "Error deleting file", details: error.message });
  }
};
