import dns from "dns";

dns.setServers([
  "1.1.1.1",
  "8.8.8.8",
]);
import "dotenv/config";
import express from "express";
import cors from "cors";

import startTaskReminder from "./schedular/taskReminder.js";

import connectDb from "./database/db.js";
import { userRouter } from "./router/user.js";
import { taskRouter } from "./router/task.js";

console.log("EMAIL USER:", process.env.EMAIL_USER);
console.log(
  "EMAIL PASS:",
  process.env.EMAIL_PASS ? "LOADED" : "NOT LOADED"
);

const app = express();

connectDb();

app.use(cors());
app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/task", taskRouter);

app.get("/", (req, res) => {
  res.status(200).send("hello");
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server is running at ${PORT}`);
  startTaskReminder();
});