"use client"
import { Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from "yup";
import Link from "next/link";
import api from "../../lib/api";
import {Eye, EyeOff} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const loginSchema = Yup.object({
    email: Yup.string()
    .email("Invalid Email")
    .required("Email is required"),
    password: Yup.string()
    .required("Password is required"),
});

export default function LoginPage(){
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <main className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <h1 className="text-3xl font-bold mb-2">
                    Welcome Back
                </h1>

                <p className="text-grey-600 mb-6">
                    login to Your Todo Account
                </p>
                <Formik
                initialValues={{
                    email:"",
                    password:"",
                }}
                validationSchema ={loginSchema}

                onSubmit={async (values, {setStatus})=>{
                    try{
                        const response = await api.post("/auth/login",values);
                        console.log("LOGIN RESPONSE: ", response.data);
                        router.push("/todos");
                    }catch(error : any){
                        console.log("LOGIN ERROR: ",error );
                        setStatus({
                            type:"error",message : error.response?.data?.message || "Login Failed",
                        });
                    }
                }}
                >
                    {({isSubmitting, status})=>(
                        <Form className="space-y-4">
                            {/* EMAIL */}
                            <div>
                                <label className="block mb-1">Email</label>
                                <Field
                                name= "email"
                                type="email"
                                placeholder="Enter Your email"
                                className="w-full border rounded px-3 py-2"
                                />
                                <ErrorMessage
                                name="email"
                                component="p"
                                className="text-red-500 text-sm mt-1"
                                />
                            </div>

                            {/* PASSWORD */}
                            <div>
                                <label className="block mb-1">Password</label>
                                <div className="relative">
                                    <Field
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter Your Password"
                                    className="w-full border rounded px-3 py-2 pr-10"
                                    />

                                    <button 
                                    type ="button"
                                    onClick={()=>setShowPassword((prev)=>!prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-grey-500"
                                    aria-label={showPassword ? "Hide Password" : "Show Password"}
                                    >
                                        {showPassword ? (<EyeOff size={20}/>) : (<Eye size={20}/>)}
                                    </button>
                                </div>
                                <ErrorMessage 
                                name="password"
                                component="p"
                                className="text-red-500 text-sm mt-1 "
                                />
                            </div>

                            {/* FORGET PASSWORD */}
                            <div className="text-right">
                                <Link 
                                href="/forget-password"
                                className="text-blue-600 text-sm"
                                >Forget Password</Link>
                            </div>

                            {/* API MESSAGE */}
                            {status?.message && (<p className="text-red-500">{status.message}</p>
                            )}

                            {/* LOGIN BUTTON */}
                            <button
                            type="submit"
                            disabled = {isSubmitting}
                            className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
                            >
                                {isSubmitting ? "Logging in..." : "Login"}
                            </button>

                            {/* REGISTER */}
                            <p  className="text-center text-sm text-grey-600">
                                Don't have an account?{" "}

                                <Link
                                href="/register"
                                className="text-blue-600">
                                    Register
                                </Link>
                            </p>
                        </Form>
                    )}
                </Formik>
            </div>
        </main>
    )

}