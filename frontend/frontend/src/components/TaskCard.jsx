
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

import { Button } from "./ui/button";
import { Pencil, Trash2 } from "lucide-react";

function TaskCard({
  id,
  title,
  description,
  status,
  dueDate,
  priority,
  onDelete,
  onEdit,
}) {
  return (
    <Card className="w-full max-w-[450px] overflow-hidden bg-white shadow-md transition hover:-translate-y-1 hover:shadow-lg sm:w-fit sm:min-w-[280px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="icon"
            className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
            onClick={() => onEdit(id)}
          >
            <Pencil />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="text-red-500 hover:bg-red-50 hover:text-red-700"
            onClick={() => onDelete(id)}
          >
            <Trash2 />
          </Button>
        </div>

        <CardTitle className="mt-4 break-words text-center text-xl text-slate-900">
          {title}
        </CardTitle>

        <CardDescription className="text-center">
          <span className="text-red-300">
            Task Description:
          </span>

          <p className="mt-1 break-words text-slate-600">
            {description || "No description"}
          </p>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* STATUS */}
        <div className="flex justify-center">
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              status === "completed"
                ? "bg-green-100 text-green-700"
                : status === "in-progress"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            Status: {status}
          </span>
        </div>

        {/* PRIORITY */}
        {priority && (
          <div className="flex justify-center">
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                priority === "high"
                  ? "bg-red-100 text-red-700"
                  : priority === "medium"
                  ? "bg-orange-100 text-orange-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              Priority: {priority}
            </span>
          </div>
        )}

        {/* DUE DATE */}
        {dueDate && (
          <div className="text-center text-sm text-slate-500">
            Due:{" "}
            {new Date(dueDate)
              .toISOString()
              .split("T")[0]}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default TaskCard;
