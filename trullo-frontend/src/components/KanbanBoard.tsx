import PlusIcon from "../icons/PlusIcon";
import { useState } from "react";
import { type Column } from "../types";
import ColumnContainer from "./ColumnContainer";

const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  console.log(columns);

  function generateId(): number {
    return Math.floor(Math.random() * 10001);
  }

  function createColumn(): void {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };
    setColumns([...columns, columnToAdd]);
  }

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto  overflow-y-hidden px-[40px] justify-center">
      <div className="m-auto flex gap-4">
        <div className="flex gap-4">
          {columns.map((col) => (
            <ColumnContainer column={col} />
          ))}
        </div>
        <button
          onClick={() => {
            createColumn();
          }}
          className=" flex gap-2  h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2"
        >
          <PlusIcon /> Add Column
        </button>
      </div>
    </div>
  );
};

export default KanbanBoard;
