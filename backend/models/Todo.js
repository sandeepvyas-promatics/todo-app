// SCHEMA FOR MangoDB
import  mongoose from "mongoose"
const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "it is required"],
      minlength: [3, "minimum 3 letter required"],
      maxLength: [100, "Maximum 100 letter required"],
    },

    description: {
      type: String,
      required: true,
      minlength: [5, "minimum 10 letter required"],
      maxlength: [500, "Maximum 500 letter required"],
    },

    dueDate: {
      type: Date,
      required: true,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Todo=mongoose.model("Todo",todoSchema);
export default Todo;
