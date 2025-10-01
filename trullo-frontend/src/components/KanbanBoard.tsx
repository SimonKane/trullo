import TaskCard from "./TaskCard";
import type { Task, Status } from "../types";
import { useEffect, useMemo, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { useAuth } from "../auth/AuthContext";
import LogoutButton from "./LogoutButton";
import AddTaskModal from "./AddTaskModal";

const COLUMNS: { id: Status; title: string }[] = [
  { id: "to-do", title: "To Do" },
  { id: "in progress", title: "In Progress" },
  { id: "done", title: "Done" },
  { id: "blocked", title: "Blocked" },
];

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filterTaskByUser, setFilterTaskByUser] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalStatus, setModalStatus] = useState<string>("to-do");
  const { auth } = useAuth();

  //TODO lägg till så man kan edit tasks

  async function getTasks() {
    try {
      const res = await fetch("http://localhost:3000/trullo/tasks");
      const data = await res.json();
      if (filterTaskByUser) {
        const filteredTasksByUser = tasks.filter(
          (task) => task.assignedTo === auth?.user.id
        );
        setTasks(filteredTasksByUser);
      } else {
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function addTask(task: any) {
    try {
      const res = await fetch("http://localhost:3000/trullo/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });
      if (!res.ok) console.error(res.status);

      getTasks();
    } catch (error) {
      console.error("ERROR adding task", error);
    }
  }

  async function deleteTask(id: string) {
    try {
      const res = await fetch(`http://localhost:3000/trullo/tasks/${id}`, {
        method: "DELETE",
      });
      console.log(res);
      if (!res.ok) throw new Error("Could not delete task");
      getTasks();
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    try {
      getTasks();
    } catch (error) {
      console.error(error);
    }
  }, [filterTaskByUser]);

  const tasksByStatus = useMemo(() => {
    const map: Record<Status, Task[]> = {
      "to-do": [],
      "in progress": [],
      done: [],
      blocked: [],
    };
    for (const t of tasks) (map[t.status] ??= []).push(t);
    return map;
  }, [tasks]);

  async function onDragEnd(result: DropResult) {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const fromStatus = source.droppableId as Status;
    const toStatus = destination.droppableId as Status;
    if (!fromStatus || !toStatus) return;

    if (fromStatus === toStatus) {
      setTasks((prev) =>
        prev.map((t) => (t.status !== fromStatus ? t : { ...t }))
      );

      return;
    }

    setTasks((prev) =>
      prev.map((t) =>
        String(t._id) === String(draggableId) ? { ...t, status: toStatus } : t
      )
    );

    try {
      const res = await fetch(
        `http://localhost:3000/trullo/tasks/${draggableId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth?.token}`,
          },
          body: JSON.stringify({ data: { status: toStatus } }),
        }
      );

      if (!res.ok) throw new Error("Error updating task");
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="flex flex-col h-screen   ">
      <div className="flex items-center justify-between bg-mainBackgroundColor p-4 ">
        <h1 className="text-xl font-bold">Logged in as {auth?.user.name}</h1>
        <div className="flex gap-20 items-center">
          <div className="flex gap-5 items-center justify-center">
            <label className="flex items-center cursor-pointer gap-3">
              <span className="text-sm text-gray-200">Show only my tasks</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={filterTaskByUser}
                  onChange={() => setFilterTaskByUser(!filterTaskByUser)}
                  className="sr-only peer"
                />
                <div className="h-5 w-9 rounded-full bg-gray-600 peer-checked:bg-blue-500 transition" />
                <div className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white peer-checked:translate-x-4 transition" />
              </div>
            </label>
          </div>
          <LogoutButton />
        </div>
      </div>

      <div className="m-auto flex min-h-screen w-full  gap-4 overflow-x-auto overflow-y-hidden px-[40px] items-center justify-center">
        <DragDropContext onDragEnd={onDragEnd}>
          {COLUMNS.map((col) => {
            const list = tasksByStatus[col.id] ?? [];

            return (
              <Droppable droppableId={col.id} key={col.id}>
                {(dropProvided) => (
                  <div
                    ref={dropProvided.innerRef}
                    {...dropProvided.droppableProps}
                    className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
                  >
                    <div className="bg-mainBackgroundColor text-md h-[60px] rounded-md rounded-b-none p-3 font-bold border-columnBackgroundColor border-4 flex items-center justify-between">
                      <div className="flex gap-2">{col.title}</div>
                    </div>

                    <div className="flex-1 p-2 overflow-y-auto space-y-2">
                      {list.map((task, index) => (
                        <Draggable
                          draggableId={String(task._id)}
                          index={index}
                          key={task._id}
                        >
                          {(dragProvided, _snapshot) => (
                            <TaskCard
                              onUpdate={() => {
                                getTasks();
                              }}
                              onDelete={deleteTask}
                              task={task}
                              innerRef={dragProvided.innerRef}
                              draggableProps={dragProvided.draggableProps}
                              dragHandleProps={dragProvided.dragHandleProps}
                            />
                          )}
                        </Draggable>
                      ))}
                      {dropProvided.placeholder}
                    </div>
                    {modalOpen && (
                      <AddTaskModal
                        isOpen={modalOpen}
                        onClose={() => {
                          setModalOpen(false);
                        }}
                        onSubmit={(task) => {
                          const data = {
                            ...task,
                            status: modalStatus,
                            assignedTo:
                              task.assignedTo === "none" ? "" : task.assignedTo,
                          };
                          addTask(data);
                        }}
                      />
                    )}
                    <button
                      onClick={() => {
                        setModalOpen(true);
                        setModalStatus(col.id);
                      }}
                      className="flex gap-2 h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2"
                    >
                      + Add Task
                    </button>
                  </div>
                )}
              </Droppable>
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
}
