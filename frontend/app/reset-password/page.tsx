'use client';
import { useEffect,useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { Eye, EyeOff} from "lucide-react";
import api from "../../lib/api";

const resetPasswordSchema = Yup.object({
    otp: Yup.string()
    .required("OTP is Required"),

    newPassword: Yup.string()
    .required("New password is required")
    .min(6,"password should be atleast 6 characters"),

    confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("newPassword")],"passwords do not match"),
});

export default function ResetPasswordPage(){
    const router = useRouter();
    // email stored from forgot password page
    const [email,setEmail] = useState("");
    //password visibility states
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    useEffect(()=>{
        const storedEmail = sessionStorage.getItem("resetEmail");
        if (storedEmail){
            setEmail(storedEmail);
        }
    },[]);

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* heading */}
                <h1 className="text-3xl font-bold text-center mb-3">Reset Password</h1>
                <p className="text-gray-400 text-center mb-8">
                    Enter the OTP sent to your email and Create a new password.
                </p>
                <Formik
                initialValues={{
                    otp:"",
                    newPassword:"",
                    confirmPassword: "",
                }}
                validationSchema={resetPasswordSchema}
                onSubmit={async (values,{setSubmitting, setStatus})=>{
                    try{
                        //Make Sure email exists
                        if(!email){
                            setStatus("Email is missing. please go back to request a new OTP.");
                            return;
                        }
                        // send reset request to backend
                        await api.post("/auth/reset-password",{
                            email,
                            otp:values.otp,
                            newPassword: values.newPassword,
                        });
                        //remove stored email after successfull reset
                        sessionStorage.removeItem("resetEmail");

                        router.push("/login");
                    }catch(error:any){
                        setStatus(error.response?.data?.message || "something went wrong. please try again.");
                    }finally{
                        setSubmitting(false);
                    }
                }}
                >
                    {({isSubmitting, status})=>(
                        <Form className="space-y-5">
                            {/* OTP */}
                            <div>
                                <label 
                                htmlFor="otp"
                                className="block text-sm font-medium mb-2"
                                >OTP</label>
                                <Field
                                id="otp"
                                type="text"
                                name="otp"
                                placeholder="Enter 6 digit OTP"
                                maxLength={6}
                                className="w-full h-11 rounded-md border border-gray-600 bg-black px-3 text-white placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"/>
                                <ErrorMessage
                                name="otp"
                                component="div"
                                className="text-red-500 text-sm mt-2"
                                />
                            </div>
                            {/* new password */}
                            <div>
                                <label
                                htmlFor="newPassword"
                                className="block text-sm font-medium mb-2">New Password</label>
                                <div className="relative">
                                    <Field
                                        id="newPassword"
                                        type={showNewPassword ? "text" : "password"}
                                        name="newPassword"
                                        placeholder="Enter Your New Password"
                                        className="w-full h-11 rounded-md border border-gray-600 bg-black px-3 pr-12 text-white placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        />

                                    <button
                                    type="button"
                                    onClick={()=>setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                    >
                                        {showNewPassword ? (<EyeOff size={20}/>) : (<Eye size={20}/>)}
                                    </button>
                                </div>
                                <ErrorMessage 
                                name="newPassword"
                                component="div"
                                className="text-red-500 text-sm mt-2"/>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label 
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium mb-2">Confirm Password</label>
                                <div className="relative">
                                    <Field
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" :"password"}
                                    name="confirmPassword"
                                    placeholder="confirm your new password"
                                    className="w-full h-11 rounded-md border border-gray-600 bg-black px-3 pr-12 text-white placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"/>
                                    <button
                                    type="button"
                                    onClick={()=> setShowConfirmPassword(!showConfirmPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                                        {showConfirmPassword ? (<EyeOff size={20}/>) : (<Eye size={20}/>)}
                                    </button>
                                </div>
                                <ErrorMessage
                                name="confirmPassword"
                                component="div"
                                className="text-red-500 text-sm mt-2"/>

                                {/* backend Error */}
                                {status && (
                                    <p className="text-red-500 text-sm">{status}</p>
                                )}
                                </div>
                                {/* reset password Button */}
                                <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-11 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                                    {isSubmitting ? "Resetting..." : "Reset Password"}
                                </button>
                                {/* Back to Login */}
                                <div className="text-center pt-2">
                                    <button
                                    type="button"
                                    onClick={()=>router.push("/login")}
                                    className="text-blue-500 hover:text-blue-400 text-sm">
                                        Back To Login
                                    </button>
                                </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}