import dotenv from "dotenv";
import connectDb from "./db/connect.js";
import app from "./app.js";

dotenv.config({ path: "./.env" });

connectDb()
  .then(() => {
    app.listen(process.env.PORT, (error) => {
      if (error) {
        return console.log("App is not listening ERROR:", error);
      }
      console.log(`App is listening: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error");
  });
