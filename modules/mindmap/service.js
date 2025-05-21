import Mindmap from './model.js';

export const saveMindmap = async (title, summaryText, dataUri, userId) => {
  const mindmap = new Mindmap({ title, summaryText, dataUri, userId });
  return await mindmap.save();
};

export const getMindmaps = async (userId) => {
  return await Mindmap.find({ userId });
};

export const deleteMindmap = async (id, userId) => {
  return await Mindmap.findOneAndDelete({ _id: id, userId });
};