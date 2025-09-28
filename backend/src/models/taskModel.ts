import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["to-do", "in progress", "done", "blocked"],
      default: "to-do",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    finishedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    finishedAt: { type: Date, default: null },
  },
  { timestamps: true, collection: "tasks" }
);

export const Task = mongoose.model("Task", taskSchema);
