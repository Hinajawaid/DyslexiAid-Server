import {
  addSummary,
  getSummariesByUserId,
  deleteSummaryById,
} from "./summary.service.js";

export const saveSummary = async (req, res) => {
  console.log("saveSpellingData controller");
  try {
    const { title, summaryText } = req.body;

    console.log(title, summaryText);

    if (!title || !summaryText) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const userId = req.user.id;
    console.log("User ID from token:", userId);

    const response = await addSummary(title, summaryText, userId);

    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

export const getSummaries = async (req, res) => {
  try {
    const userId = req.user.id;
    const summaries = await getSummariesByUserId(userId);
    res.status(200).json(summaries);
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

export const deleteSummary = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    if (!id) {
      return res.status(400).json({ message: "Missing required fields" });
    } else {
      const summary = await deleteSummaryById(id, userId);
      res.status(200).json(summary);
    }
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};
