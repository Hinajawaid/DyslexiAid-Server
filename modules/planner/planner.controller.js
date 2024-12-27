import { addTodo, fetchTodos, markTodoComplete, deleteUserTodo  } from "./planner.service.js";

export const createTodoController = async (req, res) => {
  try {
    const { name, description, category, priority, date } = req.body;

    if (!name || !category || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // const userId = req.user.id;

    const userId = "6748372a8da544e808d748ea"

    const response = await addTodo(
      name,
      description,
      date,
      category,
      priority,
      userId
    );

    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

export const getTodoController = async (req, res) => {

    // const userId = req.user.id;

    const userId = "6748372a8da544e808d748ea"
  try {
    const response = await fetchTodos(userId);

    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

export const markTodoDeleteController = async (req, res) => {
  const taskId = req.params.taskId;

    // const userId = req.user.id;

    const userId = "6748372a8da544e808d748ea"
  try {
    const response = await deleteUserTodo(taskId);
    res.json(response);
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

export const markTodoCompleteController = async (req, res) => {
  const taskId = req.params.taskId;

    // const userId = req.user.id;

    const userId = "6748372a8da544e808d748ea"
  try {
    const response = await markTodoComplete(taskId);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};
