import express from "express";
import cors from "cors";

const app = express()
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true})); 
app.use(express.static("public"));

//Routes
import userRouter from "./routes/user.routes.js";

//standard practice nameing the route as api/v1/user
app.use("/api/v1/user", userRouter);

export default app;
