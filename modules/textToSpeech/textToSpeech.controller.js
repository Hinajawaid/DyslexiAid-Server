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
