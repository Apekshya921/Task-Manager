import cron from "node-cron";
import Task from "../Model/task.js";
import User from "../Model/user.js";
import { sendTaskReminder } from "../utils/mail.js";

const startTaskReminder = () => {
  cron.schedule("0 8 * * *", async () => {
    try {
      console.log("Checking today's tasks...");

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const tasks = await Task.find({
        dueDate: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
        status: {
          $ne: "completed",
        },
      });

      console.log(
        `Found ${tasks.length} tasks due today.`
      );

      for (const task of tasks) {
        const user = await User.findById(task.user);

        if (!user) {
          continue;
        }

        await sendTaskReminder(
          user.email,
          task
        );

        console.log(
          `Reminder sent to ${user.email}`
        );
      }
    } catch (error) {
      console.error(
        "Task reminder error:",
        error
      );
    }
  });

  console.log(
    "Task reminder scheduler started."
  );
};

export default startTaskReminder;



