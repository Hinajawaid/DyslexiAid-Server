import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import PDFDocument from "pdfkit";

export const sendAudioToWhisper = async (filePath) => {
  const formData = new FormData();
  formData.append("file", fs.createReadStream(filePath));

  const response = await axios.post(
    "http://172.20.10.3:5000/transcribe/",
    formData,
    {
      headers: formData.getHeaders(),
    }
  );

  return response.data.transcription;
};

export const generatePDF = (text, filePath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);
    doc.fontSize(14).text(text, { align: "left" });
    doc.end();

    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);
  });
};
