import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      family: 4,
    });

    console.log("Mongodb conected successfully");
  } catch (error) {
    console.log(error);
  }
};

export default connectDb;