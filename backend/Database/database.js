import mongoose from "mongoose";

const connectDB = async () => {
  mongoose
  .connect(
    process.env.DB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected")) //If connected to DB
  .catch((err) => console.log(err)); //If not connected to DB
}

export default connectDB;
