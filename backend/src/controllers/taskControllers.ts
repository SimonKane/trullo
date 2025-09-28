import { Task } from "../models/taskModel.js";
import { Request, Response } from "express";
import mongoose, { isValidObjectId } from "mongoose";

export async function getTasks(_req: Request, res: Response) {
  try {
    const tasks = await Task.find();

    res.status(200).json({
      tasks: tasks,
      message: tasks.length === 0 ? "No tasks found" : "",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function createTask(req: Request, res: Response) {
  try {
    const { title, description, status, assignedTo } = req.body;
    //Kolla så user finns om man ska tilldela task till user
    if (assignedTo) {
      if (!isValidObjectId(assignedTo)) {
        return res.status(400).json({ message: "Invalid Id on user" });
      }
      const userExists = await mongoose
        .model("User")
        .exists({ _id: assignedTo });
      if (!userExists) {
        return res
          .status(404)
          .json({ message: `User with ID ${assignedTo} does not exist` });
      }
    }
    const newTask = await Task.create({
      title,
      description,
      status,
      assignedTo,
    });
    if (!newTask) {
      return res.status(400).json({ message: "Could not create task" });
    }

    res.status(201).json(newTask);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function getTaskById(req: Request, res: Response) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid Id" });
    }
    const { id } = req.params;
    const task = await Task.findById(id).populate({
      path: "assignedTo",
      select: { name: 1, email: 1 },
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function updateTask(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { data } = req.body;
    //Validera ID ifall det är ett korrekt id på Task
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid Id" });
    }

    //Validera ID ifall det är ett korrekt id på User i assignedTo
    if (data.assignedTo) {
      if (data.assignedTo && !isValidObjectId(data.assignedTo)) {
        return res.status(400).json({ message: "Invalid Id on user" });
      }
    }
    //Kolla om usern verkligen finns i databasen för att sen tilldelas en task
    if (data.assignedTo) {
      const userExists = await mongoose
        .model("User")
        .exists({ _id: data.assignedTo });
      if (!userExists) {
        return res
          .status(404)
          .json({ message: `User with ID ${data.assignedTo} does not exist` });
      }
    }

    //Kolla ifall uppdateringsdatan innehåller status-ändring (done) isåfall ändra finishedAt annars ta bort finishedAt
    if (data.status && data.status === "done") {
      data.finishedAt = new Date();
    } else if (data.status && data.status !== "done") {
      data.finishedAt = null;
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: { ...data } },
      { new: true, runValidators: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function deleteTask(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid Id" });
    }

    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({
      message: `Task with ID ${id} has been deleted`,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}
