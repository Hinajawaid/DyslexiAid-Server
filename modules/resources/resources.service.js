import resource from "./resources.model.js";

export const getResourcesById = async (id) => {
  try {
    console.log(typeof id);
    const resources = await resource.find({
      headingId: id,
    });
    console.log("Resources services:", resources);
    return resources;
  } catch (error) {
    throw new Error("Error fetching resources by id: " + error.message);
  }
};
