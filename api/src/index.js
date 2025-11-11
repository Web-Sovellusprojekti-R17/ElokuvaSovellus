import express from "express";
import cors from "cors";
import "dotenv/config";

//import templateRouter from "./routers/template_router.js";


const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//app.use("/", templateRouter);

app.listen(port, () => {
  console.log(`Server is listening port ${port}`);
});
