import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import cron from "node-cron";
import pool from "./database.js";

import groupRouter from "./routers/group_router.js";
import userRouter from "./routers/user_router.js";
import membersRouter from "./routers/member_router.js";
import reviewRouter from "./routers/review_router.js"
import messageRouter from "./routes/message_router.js";

import { authenticateToken } from "./utils/auth.js";

cron.schedule("0 * * * *", async () => {
    const now = new Date();
    console.log("cron works!")
    try{
    const res = await pool.query(
  "SELECT * FROM users WHERE is_active = false AND deletion_date <= NOW()"
);

const accountsToDelete = res.rows;

  for (const user of accountsToDelete) {
      await pool.query("DELETE FROM users WHERE user_id = $1", [user.user_id]);
  console.log(`Deleted user: ${user.user_id}`);
}
    } catch (err){
        console.error("Cron error:", err);
    }

})

const app = express();
const port = process.env.PORT;

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true // Allow cookies
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/group", groupRouter);
app.use("/user", userRouter);
app.use("/api/members", membersRouter);
app.use("/api/messages", messageRouter);
app.use(cookieParser());

app.use("/review", reviewRouter)
app.use("/user",  userRouter);

app.use("/api/members", authenticateToken, membersRouter);
app.use("/group", authenticateToken, groupRouter);

app.use((err, req, res, next) => {
    const statusCode = err.status || 500
    res.status(statusCode).json({
        error: {
            message: err.message,
            status: statusCode
        }
    })
})

app.listen(port, () => {
    console.log(`Server is listening port ${port}`);
});
