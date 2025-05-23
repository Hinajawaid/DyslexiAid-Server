import {
  getResourcesById,
  createContentService,
  getAllContents,
  getContentById,
  updateContentService,
  deleteContentService,
} from "./resources.service.js";

export const getResourcesController = async (req, res) => {
  console.log("inside getResourcesController by heading");
  try {
    const resources = await getResourcesById(req.body.id);
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createContent = async (req, res) => {
  try {
    const { title, description, link } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!image) {
      throw new Error("Image is required");
    }

    const contentData = {
      title,
      description: description || undefined,
      link,
      image,
    };

    const content = await createContentService(contentData);
    res.status(201).json(content);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateContent = async (req, res) => {
  try {
    const { title, description, link } = req.body;
    const image = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.existingImage;

    if (!image) {
      throw new Error("Image is required");
    }

    const updateData = {
      title,
      description,
      link,
      image,
    };

    const content = await updateContentService(req.params.id, updateData);
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }
    res.json(content);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getContents = async (req, res) => {
  try {
    const contents = await getAllContents();
    res.json(contents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getContent = async (req, res) => {
  try {
    const content = await getContentById(req.params.id);
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteContent = async (req, res) => {
  try {
    const content = await deleteContentService(req.params.id);
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }
    res.json({ message: "Content deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};