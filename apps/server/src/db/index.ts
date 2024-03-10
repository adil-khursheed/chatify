import mongoose from "mongoose";
import { DB_NAME } from "../constants";
import conf from "../conf/conf";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${conf.mongoURI}/${DB_NAME}`
    );

    console.log(
      `\n MongoDB connected!! DB host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB connection error: ", error);
    process.exit(1);
  }
};

export default connectDB;
