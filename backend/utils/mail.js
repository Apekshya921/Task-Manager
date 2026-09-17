import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("GMAIL CONNECTION FAILED:");
    console.log(error);
  } else {
    console.log("GMAIL CONNECTION SUCCESS:", success);
  }
});

export const sendTaskReminder = async (to, task) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: `Task Reminder: ${task.title}`,
    html: `
      <h2>Task Reminder 🔔</h2>
      <p>You have a task due today:</p>
      <h3>${task.title}</h3>
      <p>${task.description || "No description"}</p>
    `,
  });

  console.log(`Email sent to ${to}`);
};