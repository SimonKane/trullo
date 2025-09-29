import { useEffect, useState } from "react";
import type { Task } from "../types";

interface Props {
  task: Task;
  draggableProps?: any;
  dragHandleProps?: any;
  innerRef?: (el: HTMLElement | null) => void;
}

export default function TaskCard({
  task,
  dragHandleProps,
  draggableProps,
  innerRef,
}: Props) {
  const [name, setName] = useState<string>("");
  const [colors, _setColors] = useState<Record<string, string>>({
    "to-do": "bg-blue-500",
    "in progress": "bg-yellow-500",
    done: "bg-green-500",
    blocked: "bg-red-500",
  });

  async function getNameByUserId(id: string) {
    try {
      const res = await fetch(`http://localhost:3000/trullo/users/${id}`);
      const data = await res.json();
      setName(data.name);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    try {
      if (task.assignedTo) {
        getNameByUserId(task.assignedTo as string);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <div
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
      className="rounded-lg border border-columnBackgroundColor bg-mainBackgroundColor p-3 cursor-grab"
    >
      {" "}
      <div className=" flex items-center gap-2 justify-between ">
        <p className="text-sm">{task.title}</p>{" "}
        <span
          className={`h-3 min-w-3 rounded-full ${
            colors[task.status] || "bg-gray-400"
          }`}
        />
      </div>
      {task.assignedTo ? (
        <span className="text-xs text-gray-400">{name}</span>
      ) : (
        <span className="text-xs text-gray-400">No one assigned to task</span>
      )}
    </div>
  );
}
