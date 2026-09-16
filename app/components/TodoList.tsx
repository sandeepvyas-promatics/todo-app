"use client";

import TodoItem from "./TodoItem";

interface Todo {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
}

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (updatedTodo: Todo) => void;
}

export default function TodoList({
  todos,
  onToggle,
  onDelete,
  onUpdate,
}: TodoListProps) {

  if (todos.length === 0) {
    return (
      <p className="text-gray-400">
        No todos yet. Add one on the left!
      </p>
    );
  }

  return (
    <div>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}