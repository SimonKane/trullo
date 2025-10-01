import { type Task, type User } from "../types";
import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";

interface EditProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const EditTaskModal = ({ task, isOpen, onClose, onUpdate }: EditProps) => {
  const [updatedTask, setUpdatedTask] = useState<Task>(task);
  const [users, setUsers] = useState<User[]>([]);
  const { auth } = useAuth();

  async function updateTask() {
    try {
      const res = await fetch(
        `http://localhost:3000/trullo/tasks/${task._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth?.token}`,
          },
          body: JSON.stringify({
            data: {
              title: updatedTask.title,
              description: updatedTask.description ?? "",
              status: updatedTask.status,
              assignedTo: updatedTask.assignedTo || null,
            },
          }),
        }
      );
      if (!res.ok) throw new Error("Error updating task");
      onUpdate();
    } catch (error) {
      console.error(error);
    }
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setUpdatedTask((prev) => ({
      ...prev,
      [name]: name === "assignedTo" ? value || null : value,
    }));
  }

  async function getUsersFromDatabase() {
    try {
      const res = await fetch("http://localhost:3000/trullo/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getUsersFromDatabase();
  }, [isOpen]);

  if (!isOpen) return;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        className="absolute inset-0 bg-black/60"
        aria-label="Close"
      ></button>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!updatedTask.title.trim()) return;
          updateTask();
          onClose();
        }}
        className="relative w-full max-w-md rounded-xl border border-columnBackgroundColor bg-mainBackgroundColor p-4"
      >
        <h3 className="mb-3 text-lg font-bold">Edit task</h3>
        <input
          name="title"
          className="mb-2 w-full rounded bg-columnBackgroundColor p-2 text-white"
          placeholder="Title *"
          required
          value={updatedTask.title}
          onChange={handleChange}
        />
        <textarea
          name="description"
          className="mb-3 w-full rounded bg-columnBackgroundColor p-2 text-white resize-none"
          rows={3}
          value={updatedTask.description}
          onChange={handleChange}
        />
        <select
          name="assignedTo"
          className="mb-3 w-full rounded bg-columnBackgroundColor p-2 text-white"
          onChange={handleChange}
          value={updatedTask.assignedTo ?? ""}
        >
          <option value="">Unassigned</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onClose()}
            type="button"
            className="rounded bg-gray-600 px-3 py-1 hover:bg-gray-700 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded bg-blue-600 hover:bg-blue-700 px-3 py-1 cursor-pointer"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTaskModal;
