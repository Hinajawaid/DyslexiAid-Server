import * as MindmapService from './service.js';

export const generateMindMap = async (req, res) => {
    try {
      const { text } = req.body;
      if (!text || text.trim() === '') {
        return res.status(400).json({ error: 'Text is required' });
      }
      console.log('Sending text to Flask:', text);
      const response = await fetch('https://420c-34-42-231-115.ngrok-free.app/generate-mind-map', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Flask response error:', errorText);
        throw new Error('Failed to fetch from Colab');
      }
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      res.json(data);
    } catch (error) {
      console.log('Error in generateMindMap:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

export const saveMindmap = async (req, res) => {
  try {
    const { title, summaryText, dataUri } = req.body;
    if (!title || !summaryText || !dataUri) {
      return res.status(400).json({ error: 'Title, summary, and dataUri are required' });
    }
    const userId = req.user.id; // Use req.user.id from auth middleware
    console.log('Saving mindmap for user:', userId, 'with title:', title); // Debug log
    const mindmap = await MindmapService.saveMindmap(title, summaryText, dataUri, userId);
    res.status(201).json({ success: true, data: mindmap });
  } catch (error) {
    console.error('Error in saveMindmap:', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getMindmaps = async (req, res) => {
  try {
    const userId = req.user.id; // Use req.user.id
    const mindmaps = await MindmapService.getMindmaps(userId);
    res.json(mindmaps);
  } catch (error) {
    console.error('Error in getMindmaps:', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const deleteMindmap = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Use req.user.id
    const result = await MindmapService.deleteMindmap(id, userId);
    if (!result) return res.status(404).json({ error: 'Mindmap not found' });
    res.json({ success: true });
  } catch (error) {
    console.error('Error in deleteMindmap:', error.message);
    res.status(500).json({ error: error.message });
  }
};