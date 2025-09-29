export type Status = "to-do" | "in progress" | "done" | "blocked";

export interface Task {
  _id: string; // från MongoDB
  title: string;
  description?: string;
  status: Status;
  assignedTo?: string | null;
}
