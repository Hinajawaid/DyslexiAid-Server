import * as contentService from './content.service.js';

export const createContent = async (req, res) => {
    try {
      const { title, description, contentLink, category } = req.body;
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
      
      if (!imageUrl) {
        throw new Error('Image is required');
      }
  
      const contentData = {
        title,
        description: description || undefined, // Only include if provided
        contentLink,
        imageUrl,
        category
      };
  
      const content = await contentService.createContent(contentData);
      res.status(201).json(content);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  export const updateContent = async (req, res) => {
    try {
      const { title, description, contentLink, category } = req.body;
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.existingImageUrl;
      
      if (!imageUrl) {
        throw new Error('Image is required');
      }
  
      const updateData = {
        title,
        description,
        contentLink,
        imageUrl,
        category
      };
  
      const content = await contentService.updateContent(req.params.id, updateData);
      if (!content) {
        return res.status(404).json({ message: 'Content not found' });
      }
      res.json(content);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  

export const getContents = async (req, res) => {
  try {
    const contents = await contentService.getAllContents();
    res.json(contents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getContent = async (req, res) => {
  try {
    const content = await contentService.getContentById(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteContent = async (req, res) => {
  try {
    const content = await contentService.deleteContent(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getContentsByCategory = async (req, res) => {
  try {
    const contents = await contentService.getContentsByCategory(req.params.category);
    res.json(contents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
