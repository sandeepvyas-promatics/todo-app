"use client";

import { useState } from "react";
import { Formik, Form, Field } from "formik";

interface Todo {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (updatedTodo: Todo) => void;
}

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  onUpdate,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
  <div className="border rounded-md p-4 mb-3">

{isEditing ? (
  <Formik
    initialValues={{
      name: todo.name,
      description: todo.description,
      dueDate: todo.dueDate.split("T")[0],
      priority: todo.priority,
    }}
    onSubmit={(values) => {
      const updatedTodo = {
        ...todo,
        ...values,
      };

      onUpdate(updatedTodo);

      setIsEditing(false);
    }}
  >
<Form>
  <div className="flex flex-col gap-2">

    <Field
      name="name"
      className="border rounded-md p-2"
    />

    <Field
      name="description"
      className="border rounded-md p-2"
    />

    <Field
      name="dueDate"
      type="date"
      className="border rounded-md p-2"
    />

    <Field
      as="select"
      name="priority"
      className="border rounded-md p-2 bg-black text-white"
    >
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    </Field>

  <div className="flex gap-2">

    <button
      type="submit"
      className="bg-blue-600 text-white px-3 py-1 rounded-md"
    >
      Save
    </button>

    <button
      type="button"
      onClick={() => setIsEditing(false)}
      className="bg-gray-500 text-white px-3 py-1 rounded-md"
    >
      Cancel
    </button>

  </div>

  </div>
</Form>
</Formik>

) : (
<div>

  <h3
    className={`font-semibold text-lg ${
      todo.completed
        ? "line-through text-gray-400"
        : ""
    }`}
  >
    {todo.name}
  </h3>

  <p className="text-sm text-gray-400">
    {todo.description}
  </p>

  <p className="text-sm mt-1">
    Due: {todo.dueDate.split("T")[0]}
  </p>

  <p className="text-sm">
    Priority: {todo.priority}
  </p>

  <p className="text-sm font-medium">
    Status:{" "}
    {todo.completed ? "Completed" : "Pending"}
  </p>

  <div className="flex gap-2 mt-3">

    <button
      onClick={() => onToggle(todo.id)}
      className="bg-green-600 text-white px-3 py-1 rounded-md"
    >
      {todo.completed ? "Mark Pending" : "Complete"}
    </button>

    <button
      onClick={() => setIsEditing(true)}
      className="bg-blue-600 text-white px-3 py-1 rounded-md"
    >
      Edit
    </button>

    <button
      onClick={() => {
        const confirmed = confirm(
          "Are you sure that you wanna delete this Todo?"
        );

        if (confirmed) {
          onDelete(todo.id);
        }
      }}
      className="bg-red-600 text-white px-3 py-1 rounded-md"
    >
      Delete
    </button>

  </div>

</div>
      )}

    </div>
  );
}
