import { useEffect, useState } from "react";
import type { Task } from "../types";
import TrashIcon from "../icons/TrashIcon";
import EditTaskModal from "./EditTaskModal";
import { API_BASE_URL } from "../config";

interface Props {
  task: Task;
  draggableProps?: any;
  dragHandleProps?: any;
  innerRef?: (el: HTMLElement | null) => void;
  onDelete: (id: string) => void;
  onUpdate: () => void;
}

export default function TaskCard({
  task,
  dragHandleProps,
  draggableProps,
  innerRef,
  onDelete,
  onUpdate,
}: Props) {
  const [name, setName] = useState<string>("");
  const [colors, _setColors] = useState<Record<string, string>>({
    "to-do": "bg-blue-500",
    "in progress": "bg-yellow-500",
    done: "bg-green-500",
    blocked: "bg-red-500",
  });
  const [showModal, setShowModal] = useState<boolean>(false);

  // async function getNameByUserId(id: string) {
  //   try {
  //     const res = await fetch(`http://localhost:3000/trullo/users/${id}`);
  //     const data = await res.json();
  //     setName(data.name);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  useEffect(() => {
    let alive = true;

    async function load() {
      if (!task.assignedTo) {
        setName("");
        return;
      }
      try {
        const res = await fetch(
          `${API_BASE_URL}/trullo/users/${task.assignedTo}`
        );
        const data = await res.json();
        if (alive) setName(data?.name ?? "");
      } catch {
        if (alive) setName("");
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [task.assignedTo]);

  return (
    <div
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
      className="relative rounded-lg border border-columnBackgroundColor bg-mainBackgroundColor p-3 cursor-grab"
    >
      {" "}
      <div className=" flex items-center gap-2 justify-between ">
        <p
          onClick={() => {
            setShowModal(true);
          }}
          className="text-sm hover:underline cursor-pointer "
        >
          {task.title}
        </p>
        {showModal && (
          <EditTaskModal
            onUpdate={onUpdate}
            onClose={() => {
              setShowModal(false);
            }}
            isOpen={showModal}
            task={task}
          />
        )}

        <span
          className={`h-3  min-w-3 rounded-full ${
            colors[task.status] || "bg-gray-400"
          }`}
        />
      </div>
      <div className="flex justify-between gap-2 items-center mt-3  ">
        {task.assignedTo ? (
          <span className="text-xs text-gray-400">{name}</span>
        ) : (
          <span className="text-xs text-gray-400">No one assigned to task</span>
        )}
        <button
          onClick={() => {
            onDelete(task._id);
          }}
          className="stroke-gray-500 cursor-pointer hover:stroke-white hover:bg-columnBackgroundColor rounded px-1 py-2"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}
