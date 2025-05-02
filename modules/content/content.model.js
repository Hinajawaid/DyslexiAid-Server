import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  contentLink: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Educational', 'Motivational', 'Technical', 'News', 'Entertainment'],
    default: 'Educational'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Content', contentSchema);