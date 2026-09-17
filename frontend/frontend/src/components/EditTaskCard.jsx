import { useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";

import { Input } from "./ui/input";
import { Button } from "./ui/button";

function EditTaskCard({
  task,
  onUpdate,
  onCancel,
}) {
  const [title, setTitle] = useState(
    task.title
  );

  const [description, setDescription] =
    useState(task.description || "");

  const [status, setStatus] = useState(
    task.status
  );

  const [priority, setPriority] =
    useState(task.priority || "medium");

  const [dueDate, setDueDate] = useState(
    task.dueDate || ""
  );

  const handleUpdate = () => {
    if (!title.trim()) {
      return;
    }

    onUpdate({
      _id: task._id || task.id,
      title,
      description,
      status,
      priority,
      dueDate,
    });
  };

  return (
    <Card className="w-full max-w-[450px] bg-white shadow-lg">
      <CardHeader>
        <CardTitle>
          Edit Task
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">

        <Input
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          placeholder="Task title"
        />

        <Input
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          placeholder="Task description"
        />

        <select
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
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
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value)
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
          value={dueDate}
          onChange={(e) =>
            setDueDate(e.target.value)
          }
        />

        <div className="flex gap-3">

          <Button
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>

          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleUpdate}
          >
            Update
          </Button>

        </div>
      </CardContent>
    </Card>
  );
}

export default EditTaskCard;