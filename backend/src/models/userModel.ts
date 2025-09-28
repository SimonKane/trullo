import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        //Validator som kollar ifal email är i korrekt format
        validator: (mail: string) => /^\S+@\S+\.\S+$/.test(mail),
      },
    },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true, collection: "users" }
);

export const User = mongoose.model("User", userSchema);
