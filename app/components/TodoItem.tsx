"use client";

interface Todo {
  id: number;
  name: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="border rounded-md p-4 mb-3 flex justify-between items-start">
      <div>
        <h3 className={`font-semibold text-lg ${todo.completed ? "line-through text-gray-400" : ""}`}>
          {todo.name}
        </h3>
        <p className="text-sm text-gray-400">{todo.description}</p>
        <p className="text-sm mt-1">Due: {todo.dueDate}</p>
        <p className="text-sm">Priority: {todo.priority}</p>
        <p className="text-sm font-medium">
          Status: {todo.completed ? "Completed" : "Pending"}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={() => onToggle(todo.id)}
          className="bg-green-600 text-white px-3 py-1 rounded-md text-sm"
        >
          {todo.completed ? "Mark Pending" : "Complete"}
        </button>
        <button
          onClick={() => 
           { const confirmed= confirm("Are you sure that you wanna delete this Todo?");
            if (confirmed){
              onDelete(todo.id)
              
            }
          }}
          className="bg-red-600 text-white px-3 py-1 rounded-md text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}