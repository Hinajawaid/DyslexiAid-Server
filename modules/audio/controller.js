import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import Transcription from "./model.js";
import path from "path";
import { generatePDF } from "./service.js";
import mongoose from "mongoose";

export const transcribeAudio = async (req, res) => {
  try {
    console.log("Received file:", req.file);
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    console.log("File path:", filePath);

    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));

    const whisperResponse = await axios.post(
      "http://172.20.10.5:5000/transcribe/",
      formData,
      { headers: formData.getHeaders() }
    );

    console.log("Whisper response:", whisperResponse.data);

    // Extract the 'text' field from the nested 'transcription' object
    const transcriptionText = whisperResponse.data.transcription?.text;
    if (!transcriptionText) {
      throw new Error("No transcription text found in Whisper response");
    }

    console.log("Transcription:", transcriptionText);

    // Optionally, clean up the temporary audio file
    fs.unlinkSync(filePath);

    res.json({ transcription: transcriptionText });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Transcription failed", details: error.message });
  }
};

export const saveTranscription = async (req, res) => {
  try {
    const { text, fileName } = req.body;
    console.log("Request Body:", req.body);

    if (!fileName?.trim()) {
      return res.status(400).json({ error: "Filename is required" });
    }

    // const pdfFileName = `transcription_${Date.now()}.pdf`;
    // const pdfPath = path.join("uploads", pdfFileName);
    // const filePath = `uploads/${fileName.replace(/\s+/g, '_')}.txt`; // Clean filename
    // fs.writeFileSync(filePath, text);

    // Ensure uploads directory exists
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }

    // Clean filename and ensure it has a valid extension
    const cleanFileName = fileName.replace(/\s+/g, "_") + ".txt";
    const filePath = path.join("uploads", cleanFileName);
    const pdfPath = filePath.replace(".txt", ".pdf"); // Add this line

    console.log("FilePath", filePath);
    // Save text file
    fs.writeFileSync(filePath, text, "utf8");
    console.log("Text file written successfully");

    await generatePDF(text, pdfPath.replace(".txt", ".pdf"));
    console.log("PDF generated successfully");

    // Save file path to database
    const newTranscription = new Transcription({ filePath, pdfPath, text });
    console.log("New Transcription:", newTranscription);

    try {
      await newTranscription.save();
      console.log("Transcription saved to database");
    } catch (error) {
      console.error("Error saving to database:", error);
    }

    res.json({ message: "Transcription saved", filePath });
  } catch (error) {
    console.error("Error saving transcription:", error);
    res.status(500).json({ error: "Failed to save transcription" });
  }
};

// Fetch saved transcriptions
export const getSavedTranscriptions = async (req, res) => {
  try {
    const transcriptions = await Transcription.find();
    res.json(transcriptions);
  } catch (error) {
    console.error("Error fetching transcriptions:", error);
    res.status(500).json({ error: "Failed to fetch transcriptions" });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    console.log(`Received request to delete file with ID: ${fileId}`);

    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      console.log("❌ Invalid ObjectId format");
      return res.status(400).json({ error: "Invalid file ID" });
    }

    const file = await Transcription.findById(fileId);
    if (!file) {
      console.log("File not found in database");
      return res.status(404).json({ error: "File not found" });
    }

    console.log("Deleting files:", file.filePath, file.pdfPath);

    // Ensure files exist before deleting
    if (fs.existsSync(file.filePath)) fs.unlinkSync(file.filePath);
    if (fs.existsSync(file.pdfPath)) fs.unlinkSync(file.pdfPath);

    await Transcription.findByIdAndDelete(fileId); // Remove from DB
    console.log("File deleted successfully");

    res.json({ success: true, message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error); // Log detailed error
    res
      .status(500)
      .json({ error: "Error deleting file", details: error.message });
  }
};

// Get all saved transcriptions
// export const getTranscriptions = async (req, res) => {
//   try {
//     const transcriptions = await Transcription.find().sort({ timestamp: -1 }); // Fetch latest first
//     res.json(transcriptions);
//   } catch (error) {
//     console.error("Error fetching transcriptions:", error.message);
//     res.status(500).json({ error: "Failed to fetch transcriptions" });
//   }
// };

// let gfs;
// conn.once("open", () => {
//   gfs = Grid(conn.db, mongoose.mongo);
//   gfs.collection("pdfs");
// });

// // Set up storage for PDFs
// const storage = new GridFsStorage({
//   url: mongoURI,
//   file: (req, file) => {
//     return {
//       bucketName: "pdfs",
//       filename: `${Date.now()}-${file.originalname}`,
//     };
//   },
// });

// const upload = multer({ storage });

// export const savePDF = (req, res) => {
//   try {
//     res.json({ message: "File uploaded successfully!", file: req.file });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to save file" });
//   }
// };

// export const getSavedNotes = async (req, res) => {
//   try {
//     const files = await gfs.files.find().toArray();
//     res.json(files);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to retrieve notes" });
//   }
// };

// export const getFile = async (req, res) => {
//   try {
//     const file = await gfs.files.findOne({ filename: req.params.filename });
//     if (!file) {
//       return res.status(404).json({ error: "File not found" });
//     }
//     const readStream = gfs.createReadStream(file.filename);
//     readStream.pipe(res);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to retrieve file" });
//   }
// };
