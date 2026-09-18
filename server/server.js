const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB= require("./config/db");
const todoRoutes= require("./routes/todoRoutes")

const app = express();

app.use(cors());
app.use(express.json());

app.use(todoRoutes);

connectDB();

app.listen(4000, () => {
  console.log("server is running on the port 4000.");
});