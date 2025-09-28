import { User } from "../models/userModel";
import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import bcrypt from "bcrypt";

export async function getUsers(_req: Request, res: Response) {
  try {
    const users = await User.find();

    return users.length === 0
      ? res.status(404).json({ message: "No users found" })
      : res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createUser(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    //Validerar fälten här sålänge
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const emailExists = await User.exists({ email });
    if (emailExists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    //Kryptera och hasha lösenordet ->

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    //Inte skicka med lösenordet i svaret
    res.status(201).json({
      message: "User created",
      user: {
        id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
      },
    });
  } catch (error: any) {
    //Har redan typat obligatoriska fält så använder mig av mongoose error handling
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }

    res.status(500).json({ message: "Server error", error });
  }
}

export async function getUserById(req: Request, res: Response) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid Id" });
    }

    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid Id" });
    }
    const { id } = req.params;
    const loggedInUserId = (req as any).userId;
    const role = (req as any).role;

    //Kolla så det är admin eller rätt user (sin egen user) som uppdaterar
    if (role !== "admin" && loggedInUserId !== id) {
      return res
        .status(403)
        .json({ message: "Not allowed to update this user" });
    }

    const { data } = req.body;

    //Kolla så det verkligen kommer in data att uppdatera user med
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ message: "No data to update provided" });
    }

    if (data.email) {
      //Kollar alla andra email (förutom inloggad) om det redan finns en med samma email
      const emailExists = await User.exists({
        email: data.email,
        _id: { $ne: id },
      });
      if (emailExists) {
        return res.status(409).json({ message: "Email already exists" });
      }
    }

    //Hasha vid uppdatering av lösenord (inte optimalt)
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: { ...data } },
      { new: true, runValidators: true, context: "query" }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated", user });
  } catch (error: any) {
    //För att kolla så man inte anger en email som redan finns vid uppdatering **FIXA**
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
}
export async function deleteUser(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid Id" });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}
