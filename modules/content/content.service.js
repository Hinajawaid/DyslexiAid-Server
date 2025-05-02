import Content from './content.model.js';

export const createContent = async (contentData) => {
  try {
    const content = new Content(contentData);
    await content.save();
    return content;
  } catch (error) {
    throw error;
  }
};

export const getAllContents = async () => {
  try {
    return await Content.find().sort({ createdAt: -1 });
  } catch (error) {
    throw error;
  }
};

export const getContentById = async (id) => {
  try {
    return await Content.findById(id);
  } catch (error) {
    throw error;
  }
};

export const updateContent = async (id, updateData) => {
  try {
    return await Content.findByIdAndUpdate(id, updateData, { new: true });
  } catch (error) {
    throw error;
  }
};

export const deleteContent = async (id) => {
  try {
    return await Content.findByIdAndDelete(id);
  } catch (error) {
    throw error;
  }
};

export const getContentsByCategory = async (category) => {
  try {
    return await Content.find({ category }).sort({ createdAt: -1 });
  } catch (error) {
    throw error;
  }
};
