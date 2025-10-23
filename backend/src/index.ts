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

// Tillåt både lokal utveckling och Railway production
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL || "",
].filter(Boolean);

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    // Tillåt requests utan origin (t.ex. Postman, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
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
