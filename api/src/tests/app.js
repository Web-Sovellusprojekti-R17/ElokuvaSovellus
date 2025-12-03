import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";

import groupRouter from "../routers/group_router.js";
import userRouter from "../routers/user_router.js";
import membersRouter from "../routers/member_router.js";
import reviewRouter from "../routers/review_router.js"
import messageRouter from "../routers/message_router.js";

import { authenticateToken } from "../utils/auth.js";

const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/review", reviewRouter)
app.use("/user",  userRouter);
app.use("/api/messages", authenticateToken, messageRouter);
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

export default app;
