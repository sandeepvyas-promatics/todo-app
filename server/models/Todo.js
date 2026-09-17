const mongoose= require("mongoose");
const todoSchema=new mongoose.Schema({
    title:{
        type: string,
        required: [true,"it is required"],
        minlength:[3,"minimum 3 letter required"],
        maxLength:[100,"Maximum 100 letter required"],
    },
    description: {
        type: string,
        required:true,
        minlength:[10,"minimum 10 letter required"],
        maxlength:[500,"Maximum 500 letter required"]
    },
    dueDate: {
        type: Date,
        required: true,
    },
    priority: {
        type: string,
        enum:["low","medium","high"],
        required: true,
    },
    completed:{
        type:boolean,
        default: false,
    }
});

const Todo=mongoose.model("Todo",todoSchema);
module.exports=Todo;
