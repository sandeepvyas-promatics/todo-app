import mongoose from "mongoose";
import Todo from "../models/Todo.js";

const getTodos = async (req, res) => {
    try{
        const todos = await Todo.find({ user: req.user.userId,});
         res.json(todos);
    }catch (error) {
        console.log(error);
    res.status(500).json({
      message: "Server Error"
    });
  }
  
};
const getTodoById = async (req,res)=>{
    try {
    const todo = await Todo.findOne({_id:req.params.id, user: req.user.userId} );
        if(!todo){
            return res.status(404).json({
            message:"Todo Not Found"
            })
        }
    res.json(todo);
    }catch(error){
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        })
    }
  
}
const createTodo = async (req,res)=>{
    try {
    const newTodo= await Todo.create({
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate,
        priority: req.body.priority,
        user: req.user.userId,
        });
    res.status(201).json(newTodo);
    }catch(error){
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        })
    }
}
const updateTodo =  async (req,res)=>{
    try {
    const todo = await Todo.findOneAndUpdate(
    {_id:req.params.id, user: req.user.userId},
        {
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate,
        priority: req.body.priority,
        },
    {
    returnDocument: "after",
    runValidators:true,})
    if(!todo){
    return res.status(404).json({
        message:"Todo Not Found"
    });
    }
    res.json(todo);
    }catch(error){
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        })
    } 
}
const deleteTodo = async (req,res)=>{
    try {
        const todo = await Todo.findOneAndDelete({_id:req.params.id, user: req.user.userId});
        if(!todo){
        return res.status(404).json({
            message:"Todo Not Found"
            })
        }
        res.json({
            message:"Todo Deleted Successfully"
            }) 
    }catch(error){
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        })
    } 
}
const toggleTodo= async (req,res)=>{
    try {
    const todo = await Todo.findOne({_id:req.params.id, user:req.user.userId});
        if (!todo){
        return res.status(404).json({
        message:"Todo Not Found"
            })
        }
    todo.completed=!todo.completed;
    await todo.save();
    res.json(todo)
    }catch(error){
        console.log(error)
        res.status(500).json({
            message: "Server Error"
        })
    } 
}

export {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
};