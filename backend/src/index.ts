import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { User } from "./models/userModel.js";
import { Task } from "./models/taskModel";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.options(/.*/, cors(corsOptions));
app.use("/trullo", taskRoutes);
app.use("/trullo", userRoutes);

connectDB()
  .then(async () => {
    //För att initiera User och Task modellerna och deras indexes i MongoDB
    await Promise.all([User.init(), Task.init()]);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database", error);
  });
