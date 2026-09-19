import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import todoRoutes from "./routes/todoRoutes.js";
import logger from "./middleware/logger.js";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use(todoRoutes);

connectDB();

app.listen(4000, () => {
  console.log("server is running on the port 4000.");
});