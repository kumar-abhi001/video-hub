import dotenv from 'dotenv';
import mongoose from "mongoose";
import  DB_NAME  from "./constant.js";
import express from "express";
import connectDb from './db/connect.js';

dotenv.config({path: './.env'})
const app = express();
connectDb();
app.listen(process.env.PORT, () => {
    console.log("Server is listening");
});
