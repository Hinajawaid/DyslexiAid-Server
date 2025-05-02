import { addTodo, fetchTodos, markTodoComplete, deleteUserTodo  } from "./planner.service.js";
import Todo from "./planner.model.js";

export const createTodoController = async (req, res) => {
  try {
    const { name, description, category, priority, date } = req.body;

    if (!name || !category || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const userId = req.user.id;
    console.log("User ID from token:", userId);

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

    const userId = req.user.id;
    console.log("User ID from token:", userId);


  try {
    const response = await fetchTodos(userId);
    console.log("Response Sent:", response); // <-- Add this log

    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

export const markTodoDeleteController = async (req, res) => {
  const taskId = req.params.taskId;

    const userId = req.user.id;
    console.log("User ID from token:", userId);


  try {
    const response = await deleteUserTodo(taskId);
    res.json(response);
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

export const markTodoCompleteController = async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user.id;  // Extracted user ID from token

  try {
      const todo = await Todo.findOneAndUpdate(
          { _id: taskId, userId },
          { completed: true },
          { new: true }
      );

      if (!todo) {
          return res.status(404).json({ status: false, message: "Todo not found or unauthorized" });
      }

      res.status(200).json({ status: true, todo });
  } catch (error) {
      res.status(400).json({ status: false, message: error.message });
  }
};

