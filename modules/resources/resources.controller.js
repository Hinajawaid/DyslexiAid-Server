import { getResourcesById } from "./resources.service.js";

export const getResourcesController = async (req, res) => {
  const { id } = req.body; // assuming you send title as query param like ?title=Math
  console.log("Title from query:", id);

  try {
    if (!id) {
      return res
        .status(400)
        .json({ message: "id query parameter is required." });
    }
    const resources = await getResourcesById(id);
    const resources1 = [
      {
        _id: "680de0fa8812bd9696f4545c",
        title: "Understanding Dyslexia",
        image: "/uploads/dyslexia.png",
        description: "This is understanding dyslexia",
        headingId: "1",
      },
      {
        _id: "680de31b23c8c9584e804ad6",
        title: "Understanding Dyslexia",
        image: "/upload/dys.png",
        description: ".",
        headingId: "1",
        link: "https://keystoliteracy.com/blog/understanding-dyslexia/",
      },
      {
        _id: "680dff8723c8c9584e804adc",
        title: "Understanding Dyslexia",
        image: "/upload/dys.png",
        description: ".",
        headingId: "1",
        link: "https://www.understood.org/en/articles/what-is-dyslexia",
      },
    ];
    console.log("Resources:", resources);
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
