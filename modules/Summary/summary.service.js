import Summary from "./summary.model.js";
export const addSummary = async (title, summaryText, userId) => {
  try {
    const summary = {
      title,
      summaryText,
      userId,
    };

    const newSummary = new Summary(summary);

    await newSummary.save();

    return { status: true, newSummary };
  } catch (err) {
    console.log("from add summary controller", err);
    throw new Error(err.message);
  }
};

export const getSummariesByUserId = async (userId) => {
  try {
    const summaries = await Summary.find({ userId });
    return summaries;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const deleteSummaryById = async (id, userId) => {
  try {
    const summary = await Summary.findByIdAndDelete(id);
    return summary;
  } catch (err) {
    throw new Error(err.message);
  }
};
