import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import todoRoutes from "./routes/todoRoutes.js";
import logger from "./middleware/logger.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(logger);

app.use(authRoutes);
app.use(todoRoutes);

const startServer = async ()=>{
  try{
   await connectDB();

    app.listen(4000, () => {
      console.log("server is running on the port 4000.");
    });
  }catch(error){
    console.error("fails to start server: ", error);
    process.exit(1);
  }
};
startServer();
