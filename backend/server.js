import express, { json } from "express";
import router from "./Router/router.js";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./Database/database.js";

dotenv.config();
const app = express();


// Serve static files from the "public" directory
app.use(express.static(path.join(path.dirname(''), "public")));
app.use(json());
// Middlewares
app.use(cors("*"));
app.use(router);
app.set("view engine", "hbs");
app.set('views', path.join(path.dirname(''), 'views'));

app.listen(process.env.PORT, (err) => {
  if (err) {
    return console.log("Error in listening ", err);
  }
  console.log("Server is running on PORT: ", process.env.PORT);
  connectDB();
});
