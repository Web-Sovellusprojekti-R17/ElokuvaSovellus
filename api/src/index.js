import express from "express";
import cors from "cors";
import "dotenv/config";

import groupRouter from "./routers/group_router.js";
import userRouter from "./routers/user_router.js";
import membersRouter from "./routers/member_router.js";
import reviewRouter from "./routers/review_router.js"
import messageRouter from "./routes/message_router.js";


const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/group", groupRouter);
app.use("/user", userRouter);
app.use("/api/members", membersRouter);
app.use("/api/messages", messageRouter);
app.use("/review", reviewRouter)

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
