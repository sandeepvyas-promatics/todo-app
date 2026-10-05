"use client";
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from "yup";
import {useRouter} from "next/navigation";
import api from "../../lib/api";

const forgetPasswordSchema = Yup.object({
    email : Yup.string()
    .email("Enter a valid Email")
    .required("Email is required")
});

export default function forgotPasswordPage(){
    const router = useRouter();
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* HEADING */}
                <h1 className="text-3xl font-bold text-center mb-3">
                    Forgot Password
                </h1>
                <p className="text-gray-400 text-center mb-8">
                    Enter Your Email and we'll send you and OTP to reset Your password.
                </p>

                <Formik
                initialValues={{email:"",}}
                validationSchema={forgetPasswordSchema}
                onSubmit={async (values,{setSubmitting, setStatus})=>{
                    try{
                        await api.post("/auth/forgot-password",{
                            email : values.email,
                        });
                        sessionStorage.setItem("resetEmail",values.email);
                        router.push("/reset-password");
            } catch(error: any){
                setStatus(error.response?.data?.message || "Something went wrong. try again")
                    }finally{
                        setSubmitting(false);
                    }
                }}
                >
                    {({isSubmitting, status})=>(
                        <Form className="space-y-5">
                            {/* Email */}
                            <div>
                                <label htmlFor="email"
                                className="block text-sm font-medium">Email</label>
                                <Field
                                id="email"
                                type = "email"
                                name = "email"
                                placeholder = "Enter Your email"
                                className="w-full h-11 rounded-md border border-gray-600 bg-black px-3 text-white placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 "
                                />
                                <ErrorMessage
                                name="email"
                                component="div"
                                className="text-red-500 text-sm mt-2"
                                />
                            </div>
                            {/* Backend error */}
                            {status && (
                                <p className="text-red-500 text-sm">{status}</p>
                            )}
                            {/* Send Otp */}
                            <button
                            type="submit"
                            disabled = {isSubmitting}
                            className="w-full h-11 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Sending..." : "Send OTP"}
                            </button>
                            {/* Back to login */}
                            <div className="text-center pt-2">
                                <button
                                type="button"
                                onClick={()=>router.push("/login")}
                                className="text-blue-500 hover:text-blue-400 text-sm"
                                >
                                    Back to Login
                                </button>
                            </div>
                        </Form>
                    )}

                </Formik>
            </div>
        </div>
    )
}