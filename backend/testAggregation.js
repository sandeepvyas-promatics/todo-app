import mongoose from "mongoose";
import dotenv from "dotenv";
import getTodosWithAggregation from "./services/todoAggregationService.js";

dotenv.config();

const testAggregation = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const userId = "6ab4b40cb1802ed09a7027d1";

    const todos = await getTodosWithAggregation(userId ,"pending","high","dueDateAsc");

    console.log("Aggregation Result:");
    console.dir(todos,{ depth: null });

  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
  }
};

testAggregation();