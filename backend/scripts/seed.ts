import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "../src/models/userModel";
import { Task } from "../src/models/taskModel";
import { connectDB } from "../src/config/db";
import { faker } from "@faker-js/faker";

const SALT_ROUNDS = 10;

const adminEmail = "trullo.admin@example.com";
const adminPassword = "Passw0rd!";
const userEmail = "trullo.user@example.com";
const userPassword = "Passw0rd!";

async function main() {
  await connectDB();
  await Promise.all([User.deleteMany({}), Task.deleteMany({})]);

  const [adminHash, userHash] = await Promise.all([
    bcrypt.hash(adminPassword, SALT_ROUNDS),
    bcrypt.hash(userPassword, SALT_ROUNDS),
  ]);

  const admin = await User.create({
    name: "Trullo Admin",
    email: adminEmail,
    password: adminHash,
    role: "admin",
  });

  const user = await User.create({
    name: "Trullo User",
    email: userEmail,
    password: userHash,
    role: "user",
  });

  console.log("👤 Created users:", { admin: admin.email, user: user.email });

  const STATUSES = ["to-do", "in progress", "done", "blocked"];

  const userTasks = Array.from({ length: 4 }).map(() => ({
    title: faker.hacker.phrase(),
    description: faker.lorem.sentence(),
    status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
    assignedTo: user._id,
  }));

  const adminTasks = Array.from({ length: 2 }).map(() => ({
    title: faker.company.buzzPhrase(),
    description: faker.lorem.sentence(),
    status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
    assignedTo: admin._id,
  }));

  const unassigned = Array.from({ length: 4 }).map(() => ({
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
    assignedTo: null,
  }));

  const tasks = await Task.insertMany([
    ...userTasks,
    ...adminTasks,
    ...unassigned,
  ]);

  console.log(`📝 Inserted ${tasks.length} tasks`);

  await mongoose.disconnect();
  console.log("✅ Seed complete. Disconnected.");
}

main().catch(async (err) => {
  console.error("❌ Seed failed:", err);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
