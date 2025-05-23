import mongoose from 'mongoose';

const mindmapSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summaryText: { type: String, required: true },
  dataUri: { type: String }, // Store base64 image (temporary solution)
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Associate with user
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Mindmap', mindmapSchema);