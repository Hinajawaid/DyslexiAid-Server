import mongoose from "mongoose";

const transcriptionSchema = new mongoose.Schema({
    text: String,
    pdfPath:String,
    timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Transcription", transcriptionSchema);
