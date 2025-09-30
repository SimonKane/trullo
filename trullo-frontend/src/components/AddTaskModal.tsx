import { type User } from "../types";
import { useState, useEffect } from "react";

interface AskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: TaskDraft) => void;
}

type TaskDraft = {
  title: string;
  description?: string;
  assignedTo: string | null;
};

const AddTaskModal = ({ isOpen, onClose, onSubmit }: AskModalProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [task, setTask] = useState<TaskDraft>({
    title: "",
    description: "",
    assignedTo: null,
  });

  async function getUsersFromDatabase() {
    try {
      const res = await fetch("http://localhost:3000/trullo/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setTask((prev) => ({
      ...prev,
      [name]: name === "assignedTo" ? value || null : value,
    }));
  }

  useEffect(() => {
    try {
      if (isOpen) {
        setTask({ title: "", description: "", assignedTo: null });
      }
      getUsersFromDatabase();
    } catch (error) {
      console.log(error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        className="absolute inset-0 bg-black/60"
        aria-label="Close"
      ></button>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!task.title) return;
          onSubmit(task);
          onClose();
        }}
        className="relative w-full max-w-md rounded-xl border border-columnBackgroundColor bg-mainBackgroundColor p-4"
      >
        <h3 className="mb-3 text-lg font-bold">Add task</h3>
        <input
          name="title"
          className="mb-2 w-full rounded bg-columnBackgroundColor p-2 text-white"
          placeholder="Title *"
          required
          value={task.title}
          onChange={handleChange}
        />
        <textarea
          name="description"
          className="mb-3 w-full rounded bg-columnBackgroundColor p-2 text-white resize-none"
          rows={3}
          value={task.description}
          onChange={handleChange}
        />
        <select
          name="assignedTo"
          className="mb-3 w-full rounded bg-columnBackgroundColor p-2 text-white"
          value={task.assignedTo ?? ""}
          onChange={handleChange}
        >
          <option value="">Assign to:</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
          <option value="none">None</option>
        </select>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              onClose();
            }}
            type="button"
            className="rounded bg-gray-600 px-3 py-1 hover:bg-gray-700 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded bg-blue-600 hover:bg-blue-700 px-3 py-1 cursor-pointer"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTaskModal;
