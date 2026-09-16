"use client";

import * as Yup from "yup";
import { Form, Field, Formik } from "formik";

interface TodoData {
  name: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
}

interface TodoFormProps {
  onAdd: (todo: TodoData) => void;
}

const ValidationSchema = Yup.object({
  name: Yup.string()
    .required("Name is required.")
    .min(3, "more then 3 letters required."),

  description: Yup.string()
    .required("description is required.")
    .max(100, "description can't exceed 100 letters."),

  dueDate: Yup.string()
    .required("Due date is required."),

  priority: Yup.string()
    .required("Priority is required."),
});

export default function TodoForm({ onAdd }: TodoFormProps) {
  return (
    <Formik
      initialValues={{
        name: "",
        description: "",
        dueDate: "",
        priority: "",
      }}
      validationSchema={ValidationSchema}
      onSubmit={(values, { resetForm }) => {
        const newTodo: TodoData = {
          name: values.name,
          description: values.description,
          dueDate: values.dueDate,
          priority: values.priority as "low" | "medium" | "high",
        };

        onAdd(newTodo);

        resetForm();
      }}
    >
      {({ errors, touched }) => (
        <Form className="max-w-xl mx-auto mt-10 p-6 rounded-xl shadow-lg space-y-5">

          <div>
            <label className="block mb-2">
              Name
            </label>

            <Field
              type="text"
              name="name"
              placeholder="Enter the Name:"
              className="w-full border rounded-md p-2"
            />

            {touched.name && errors.name && (
              <p>{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block mb-2">
              Description
            </label>

            <Field
              as="textarea"
              name="description"
              placeholder="Enter todo description"
              className="w-full border rounded-md p-2 min-h-24"
            />

            {touched.description && errors.description && (
              <p>{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block mb-2">
              Due Date
            </label>

            <Field
              name="dueDate"
              type="date"
              className="w-full border rounded-md p-2"
            />

            {touched.dueDate && errors.dueDate && (
              <p>{errors.dueDate}</p>
            )}
          </div>

          <div>
            <label className="block mb-2">
              Priority
            </label>

            <Field
              as="select"
              name="priority"
              className="w-full border rounded-md p-2 bg-white text-black"
            >
              <option value="">Select Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Field>

            {touched.priority && errors.priority && (
              <p>{errors.priority}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-md p-2 font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Add Todo
          </button>

        </Form>
      )}
    </Formik>
  );
}