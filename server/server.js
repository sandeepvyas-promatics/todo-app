const express = require("express");
require("dotenv").config();

const connectDB= require("./config/db");
const app = express();

app.use(express.json());
connectDB();
app.listen(4000, () => {
  console.log("server is running on the port 4000.");
});












// let todos = [
//   {
//     id: 1,
//     title: "Learn Express",
//     description: "Understand backend",
//     dueDate: "2026-09-20",
//     priority: "high",
//     completed: false,
//   },

//   {
//     id: 2,
//     title: "Learn APIs",
//     description: "Understand request and response",
//     dueDate: "2026-09-22",
//     priority: "medium",
//     completed: false,
//   },
// ];

// // GET all todos
// app.get("/todos", (req, res) => {
//   res.json(todos);
// });

// // get one todo
// app.get("/todos/:id", (req, res) => {
//   const id = Number(req.params.id);

//   const todo = todos.find((todo) => todo.id === id);
//   if(!todo){
//     return res.status(404).json({
//       message:"Todo Not Found",
//     })
//   }
//   res.json(todo);
// });

// // POST new todo
// app.post("/todos", (req, res) => {
//   const newTodo = {
//     id: Date.now(),
//     title: req.body.title,
//     description: req.body.description,
//     dueDate: req.body.dueDate,
//     priority: req.body.priority,
//     completed: false,
//   };

//   todos.push(newTodo);

//   res.json(newTodo);
// });

// // UPDATE existing todo
// app.patch("/todos/:id", (req, res) => {
//   const id = Number(req.params.id);

//   const todo = todos.find((todo) => todo.id === id);
//   if (!todo){
//     return res.status(404).json({
//       message:"Todo Not Found.",
//     })
//   }

//   todo.title = req.body.title;
//   todo.description = req.body.description;
//   todo.dueDate = req.body.dueDate;
//   todo.priority = req.body.priority;

//   res.json(todo);
// });

// // DELETE todo
// app.delete("/todos/:id", (req, res) => {
//   const id = Number(req.params.id);

//   const todo = todos.find((todo) => todo.id === id);
//   if (!todo){
//     return res.status(404).json(
//       {message:"Todo Not Found"});
//     }

//    todos = todos.filter((todo) => todo.id !== id);
//   res.json({
//     message: "TODO deleted Successfully",
//   });
// });
