import Resource from "./resources.model.js";

export const getResourcesById = async (id) => {
  try {
    console.log(typeof id);
    const resources = await Resource.find({
      headingId: id,
    });
    console.log("Resources services:", resources);
    return resources;
  } catch (error) {
    throw new Error("Error fetching resources by id: " + error.message);
  }
};

export const createContentService = async (contentData) => {
  try {
    const content = new Resource(contentData);
    await content.save();
    return content;
  } catch (error) {
    throw error;
  }
};

export const getAllContents = async () => {
  try {
    return await Resource.find().sort({ createdAt: -1 });
  } catch (error) {
    throw error;
  }
};

export const getContentById = async (id) => {
  try {
    return await Resource.findById(id);
  } catch (error) {
    throw error;
  }
};

export const updateContentService = async (id, updateData) => {
  try {
    return await Resource.findByIdAndUpdate(id, updateData, { new: true });
  } catch (error) {
    throw error;
  }
};

export const deleteContentService = async (id) => {
  try {
    return await Resource.findByIdAndDelete(id);
  } catch (error) {
    throw error;
  }
};