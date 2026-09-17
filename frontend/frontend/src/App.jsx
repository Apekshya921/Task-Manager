import { useEffect, useState } from "react";

import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

import TaskCard from "./components/TaskCard";
import EditTaskCard from "./components/EditTaskCard";
import Auth from "./components/Auth";

import { Toaster, toast } from "sonner";

import api from "./api/axios";

function App() {
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [tasks, setTasks] = useState([]);

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] =
    useState("");

  const [taskStatus, setTaskStatus] =
    useState("todo");

  const [taskDueDate, setTaskDueDate] =
    useState("");

  const [taskPriority, setTaskPriority] =
    useState("medium");

  const [editingTaskId, setEditingTaskId] =
    useState(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [filterStatus, setFilterStatus] =
    useState("all");

  // GET TASKS
  useEffect(() => {
    if (!token) {
      return;
    }

    const fetchTasks = async () => {
      try {
        const response = await api.get("/task");

        setTasks(response.data.tasks || []);
      } catch (error) {
        console.error(
          "Failed to fetch tasks:",
          error
        );

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          setToken(null);
          setTasks([]);

          toast.error(
            "Session expired. Please login again."
          );
        } else {
          toast.error(
            error.response?.data?.message ||
              "Failed to load tasks"
          );
        }
      }
    };

    fetchTasks();
  }, [token]);

  // ADD TASK
  const addTask = async () => {
    if (!taskTitle.trim()) {
      toast.error("Task title is required");
      return;
    }

    try {
      const response = await api.post("/task", {
        title: taskTitle,
        description: taskDescription,
        status: taskStatus,
        dueDate: taskDueDate,
        priority: taskPriority,
      });

      const newTask = response.data.task;

      setTasks((previousTasks) => [
        ...previousTasks,
        newTask,
      ]);

      setTaskTitle("");
      setTaskDescription("");
      setTaskStatus("todo");
      setTaskDueDate("");
      setTaskPriority("medium");

      toast.success(
        "Task created successfully!"
      );
    } catch (error) {
      console.error(
        "Failed to create task:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to create task"
      );
    }
  };

  // DELETE TASK
  const deleteTask = async (id) => {
    try {
      await api.delete(`/task/${id}`);

      setTasks((previousTasks) =>
        previousTasks.filter(
          (task) =>
            (task._id || task.id) !== id
        )
      );

      if (editingTaskId === id) {
        setEditingTaskId(null);
      }

      toast.success(
        "Task deleted successfully!"
      );
    } catch (error) {
      console.error(
        "Failed to delete task:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to delete task"
      );
    }
  };

  // OPEN EDIT
  const editTask = (id) => {
    setEditingTaskId(id);
  };

  // UPDATE TASK
  const updateTask = async (updatedTask) => {
    try {
      const id =
        updatedTask._id || updatedTask.id;

      const response = await api.put(
        `/task/${id}`,
        {
          title: updatedTask.title,
          description:
            updatedTask.description,
          status: updatedTask.status,
          dueDate: updatedTask.dueDate,
          priority: updatedTask.priority,
        }
      );

      const updated = response.data.task;

      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          (task._id || task.id) === id
            ? updated
            : task
        )
      );

      setEditingTaskId(null);

      toast.success(
        "Task updated successfully!"
      );
    } catch (error) {
      console.error(
        "Failed to update task:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update task"
      );
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const search =
      searchTerm.toLowerCase();

    const matchesSearch =
      task.title
        ?.toLowerCase()
        .includes(search) ||
      task.description
        ?.toLowerCase()
        .includes(search);

    const matchesFilter =
      filterStatus === "all" ||
      task.status === filterStatus;

    return (
      matchesSearch && matchesFilter
    );
  });

  // DASHBOARD
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) =>
      task.status === "completed"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) =>
      task.status === "in-progress"
  ).length;

  const todoTasks = tasks.filter(
    (task) => task.status === "todo"
  ).length;

  const completionPercentage =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks / totalTasks) *
            100
        );

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");

    setToken(null);
    setTasks([]);
    setEditingTaskId(null);

    toast.success(
      "Logged out successfully!"
    );
  };

  if (!token) {
    return (
      <>
        <Toaster position="top-right" />

        <Auth
          onLogin={(newToken) => {
            setToken(newToken);
          }}
        />
      </>
    );
  }

  return (
    <>
      <Toaster position="top-right" />

      <main className="min-h-screen bg-slate-100 p-4 sm:p-8">
        <div className="mx-auto max-w-6xl">


          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                Task Manager
              </h1>

              <p className="mt-2 text-slate-500">
                Manage your tasks easily and stay organized.
              </p>
            </div>

            <Button
              variant="outline"
              onClick={logout}
              className="w-full sm:w-auto hover:bg-purple-200 bg-purple-500 cursor-pointer"
            >
              Logout
            </Button>
          </div>

          {/* DASHBOARD */}

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-slate-800">
              Dashboard
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Total Tasks
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {totalTasks}
                </p>
              </div>

              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Todo
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-700">
                  {todoTasks}
                </p>
              </div>

              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  In Progress
                </p>

                <p className="mt-2 text-3xl font-bold text-yellow-600">
                  {inProgressTasks}
                </p>
              </div>

              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Completed
                </p>

                <p className="mt-2 text-3xl font-bold text-green-600">
                  {completedTasks}
                </p>
              </div>

            </div>

            {/* PROGRESS */}

            <div className="mt-4 rounded-xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="font-medium text-slate-700">
                  Completion Progress
                </p>

                <p className="font-bold text-blue-600">
                  {completionPercentage}%
                </p>
              </div>

              <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-500"
                  style={{
                    width: `${completionPercentage}%`,
                  }}
                />
              </div>
            </div>
          </section>

          {/* CREATE TASK */}

          <section className="rounded-xl bg-white p-5 shadow-sm sm:p-6">

            <h2 className="mb-4 text-xl font-semibold text-slate-800">
              Create a new task
            </h2>

            <div className="space-y-4">

              <Input
                type="text"
                value={taskTitle}
                onChange={(e) =>
                  setTaskTitle(
                    e.target.value
                  )
                }
                placeholder="Enter task title"
              />

              <Input
                type="text"
                value={taskDescription}
                onChange={(e) =>
                  setTaskDescription(
                    e.target.value
                  )
                }
                placeholder="Enter task description"
              />

              <select
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                value={taskStatus}
                onChange={(e) =>
                  setTaskStatus(
                    e.target.value
                  )
                }
              >
                <option value="todo">
                  Todo
                </option>

                <option value="in-progress">
                  In Progress
                </option>

                <option value="completed">
                  Completed
                </option>
              </select>

              <select
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                value={taskPriority}
                onChange={(e) =>
                  setTaskPriority(
                    e.target.value
                  )
                }
              >
                <option value="low">
                  Low Priority
                </option>

                <option value="medium">
                  Medium Priority
                </option>

                <option value="high">
                  High Priority
                </option>
              </select>

              <Input
                type="date"
                value={taskDueDate}
                onChange={(e) =>
                  setTaskDueDate(
                    e.target.value
                  )
                }
              />

              <Button
                onClick={addTask}
                className="bg-purple-900 hover:bg-purple-800"
              >
                Add Task
              </Button>

            </div>
          </section>

          {/* TASKS */}

          <section className="mt-8">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  My Tasks
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Showing{" "}
                  {filteredTasks.length}{" "}
                  of {tasks.length} tasks
                </p>
              </div>

              <Input
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
                placeholder="Search tasks..."
                className="w-full lg:w-[280px]"
              />
            </div>

            {/* FILTER */}

            <div className="mt-4">
              <select
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 sm:w-auto"
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(
                    e.target.value
                  )
                }
              >
                <option value="all">
                  All Tasks
                </option>

                <option value="todo">
                  Todo
                </option>

                <option value="in-progress">
                  In Progress
                </option>

                <option value="completed">
                  Completed
                </option>
              </select>
            </div>

            {/* EDIT */}

            {editingTaskId && (
              <div className="mt-6">
                <EditTaskCard
                  task={tasks.find(
                    (task) =>
                      (task._id || task.id) ===
                      editingTaskId
                  )}
                  onUpdate={updateTask}
                  onCancel={() =>
                    setEditingTaskId(null)
                  }
                />
              </div>
            )}

            {/* TASK CARDS */}

            <div className="mt-6 flex flex-wrap gap-6">

              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <TaskCard
                    key={
                      task._id || task.id
                    }
                    id={
                      task._id || task.id
                    }
                    title={task.title}
                    description={
                      task.description
                    }
                    status={task.status}
                    dueDate={task.dueDate}
                    priority={task.priority}
                    onDelete={deleteTask}
                    onEdit={editTask}
                  />
                ))
              ) : (
                <p className="text-slate-500">
                  {tasks.length === 0
                    ? "No tasks yet."
                    : "No tasks found."}
                </p>
              )}

            </div>
          </section>

        </div>
      </main>
    </>
  );
}

export default App;