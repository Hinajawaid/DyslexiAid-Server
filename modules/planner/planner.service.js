import Todo from "./planner.model.js";

export const addTodo = async (
  name,
  description,
  date,
  category,
  priority,
  userId
) => {
  try {
    const task = {
      name,
      category,
      description,
      priority,
      date,
      userId,
    };

    const newTask = new Todo(task);

    await newTask.save();

    return { status: true, newTask };
  } catch (err) {
    console.log("from add todo controller", err);
    throw new Error(err.message);
  }
};

export const fetchTodos = async (userId) => {
  try {
    const todos = await Todo.find({ userId });
    return {
      status: true,
      todos,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteUserTodo = async (taskId) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id:taskId });

    if (!todo) {
      throw new Error("Task not found");
    }
    return {
      status: true,
      todo,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
export const markTodoComplete = async (taskId) => {
  try {
    const todo = await Todo.findOne({ _id:taskId });

    if (!todo) {
      throw new Error("Task not found");
    }

    todo.completed = true;
    await todo.save();

    return {
      status: true,
      todo,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
