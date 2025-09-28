import { connectDB } from "../src/config/db.js"; // din befintliga connect-funktion
import { User } from "../src/models/userModel.js";
import { Task } from "../src/models/taskModel.js";

(async () => {
  try {
    await connectDB();

    await User.deleteMany({});
    await Task.deleteMany({});

    console.log("Users and Tasks collections cleared!");
    process.exit(0);
  } catch (err) {
    console.error("Error clearing collections:", err);
    process.exit(1);
  }
})();
