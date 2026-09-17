import Task from "../Model/task.js";

// CREATE TASK
export const addTask = async (req, res) => {
  try {
    const {
      title,
      description,
      dueDate,
      priority,
      status,
    } = req.body;

    const existTitle = await Task.findOne({
      title,
      user: req.user.id,
    });

    if (existTitle) {
      return res.status(400).json({
        message:
          "Another task with the same name already exists",
      });
    }

    const addTask = await Task.create({
      title,
      description,
      dueDate,
      priority,
      status,
      user: req.user.id,
    });

    return res.status(201).json({
      message: "Task created successfully",
      task: addTask,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// GET ALL MY TASKS
export const findTask = async (req, res) => {
  try {
    const findTask = await Task.find({
      user: req.user.id,
    });

    return res.status(200).json({
      tasks: findTask,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// GET MY TASK BY ID
export const findTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const findTask = await Task.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!findTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      task: findTask,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// UPDATE MY TASK
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      dueDate,
      status,
      priority,
    } = req.body;

    const updateData = {};

    if (title) {
      updateData.title = title;
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    if (dueDate !== undefined) {
      updateData.dueDate = dueDate;
    }

    if (status) {
      updateData.status = status;
    }

    if (priority) {
      updateData.priority = priority;
    }

    const updatedTask =
      await Task.findOneAndUpdate(
        {
          _id: id,
          user: req.user.id,
        },
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// DELETE MY TASK
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask =
      await Task.findOneAndDelete({
        _id: id,
        user: req.user.id,
      });

    if (!deletedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// SEARCH TASKS
export const findTasks = async (req, res) => {
  try {
    const {
      search,
      status,
      priority,
      sort,
    } = req.query;

    const query = {
      user: req.user.id,
    };

    if (search) {
      query.title = {
        $regex: search,
        $options: "i",
      };
    }

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    let sortOption = {};

    if (sort === "newest") {
      sortOption.createdAt = -1;
    }

    if (sort === "oldest") {
      sortOption.createdAt = 1;
    }

    const findTask = await Task.find(query).sort(
      sortOption
    );

    return res.status(200).json({
      tasks: findTask,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// DASHBOARD
export const dashboard = async (req, res) => {
  try {
    const total = await Task.countDocuments({
      user: req.user.id,
    });

    const completed =
      await Task.countDocuments({
        user: req.user.id,
        status: "completed",
      });

    const inProgress =
      await Task.countDocuments({
        user: req.user.id,
        status: "in-progress",
      });

    const todo = await Task.countDocuments({
      user: req.user.id,
      status: "todo",
    });

    return res.status(200).json({
      total,
      completed,
      inProgress,
      todo,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};