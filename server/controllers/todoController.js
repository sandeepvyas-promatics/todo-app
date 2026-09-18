const Todo = require("../models/Todo");

const getTodos = async (req, res) => {
    try{
        const todos = await Todo.find();
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
    const todo = await Todo.findById(req.params.id);
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
    const todo = await Todo.findByIdAndUpdate(
    req.params.id,
        {
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate,
        priority: req.body.priority,
        },
    {
    new:true,
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
        const todo = await Todo.findByIdAndDelete(req.params.id);
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
    const todo = await Todo.findById(req.params.id);
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
module.exports= {getTodos,getTodoById,createTodo,updateTodo,deleteTodo,toggleTodo};