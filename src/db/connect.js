import mongoose from "mongoose";
import {DB_NAME} from "../constant.js";

const connectDb = async () => {
  try {
    const conectionInstance = await mongoose.connect(
      `${process.env.MONGO_URi}/${DB_NAME}`
    );
    console.log(
      `DB is connected || DB_HOST: ${conectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("Error in connect db: ", error);
    process.exit(1);
  }
};

export default connectDb;
