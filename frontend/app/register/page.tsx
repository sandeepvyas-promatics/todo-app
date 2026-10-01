"use client";
import { Formik , Form, Field, ErrorMessage} from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
const registerSchema = Yup.object({
  name: Yup.string()
  .required("Name is required")
  .min(3,"Name must be atleast 3 characters"),

  email: Yup.string()
  .email("Invalid email")
  .required("Email is Required"),
  password: Yup.string()
  .required("password is required")
  .min(6,"password must be at least 6 characters"),
});

export default function RegisterPage(){
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6">Create Account</h1>

        <Formik initialValues={{
          name: "",
          email: "",
          password: "",
        }}
        validationSchema={registerSchema} onSubmit={async (values,{setSubmitting, setStatus})=>{
          try{
            const response = await api.post("/auth/register",values);
            console.log("REGISTER RESPONSE: ",response.data);
            // keep the images because the OTP page needs it
            sessionStorage.setItem("verificationEmail", values.email);

            router.push("/verify-otp");
          }catch(error: any){
            console.log("REGISTER ERROR: ",error);
            setStatus(error.response?.data?.message || "Registration Failed");
          }finally{
            setSubmitting(false);
          }
        }}
        >
          {({isSubmitting, status})=>(
            <Form className="space-y-4">
              <div>
                <label className="block mb-1"> Name </label>
                <Field 
                name = "name"
                type = "text"
                placeholder= "Enter your Name" 
                className="w-full border rounded px-3 py-2"
                />
                <ErrorMessage
                name="name"
                component="p"
                className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <label className="Block mb-1">Email</label>
                <Field
                name="email"
                type="email"
                placeholder="Enter Your Email"
                className = "w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1">Password</label>
              <div className="relative">

                <Field
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Enter your password"
                  className="w-full border rounded px-3 py-2 pr-10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>

              </div>
                <ErrorMessage
                name="password"
                component="p"
                className="text-red-500 text-sm mt-1"
                />
              </div>
              {status && (<p className="text-red-500">{status}</p>)}
              <button 
              type="submit"
              disabled= {isSubmitting}
              className="w-full bg-blue-600 text-white py-2 rounded">
                {isSubmitting ? "Creating Account" : "Register User"}
              </button>
              {/* REGISTER */}
              <p className="text-center text-sm text-gray-600">
                Do you have an account?{" "}

                <Link
                  href="/login"
                  className="text-blue-600"
                >
                  Login
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </main>
  );
}