"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import api from "../../lib/api";

const otpSchema = Yup.object({
    otp: Yup.string()
    .required("OTP is required")
    .max(6)
    .min(6)
});
export default function VerifyOtpPage(){
    const router = useRouter();

    const email= typeof window !== "undefined" ? sessionStorage.getItem("verificationEmail"): null ;

    return (
        <main className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <h1 className=" text-3xl font-bold mb-2">
                    Verify Your Email
                </h1>
                <p className="text-grey-600 mb-6">
                    Enter the 6-digit OTP sent to your email.
                </p>

                <Formik
                initialValues={{otp:"",}}
                validationSchema={otpSchema}
                onSubmit={async (values, {setSubmitting,setStatus})=>{
                    try{
                        if (!email){
                            setStatus({
                                type:"error", message:"Email Not Found. REGISTER AGAIN."
                            });
                            return;
                        }
                        const response = await api.post("/auth/verify-otp",{email,otp:values.otp});
                        console.log("VERIFY OTP RESPONSE: ",response.data);
                        sessionStorage.removeItem("verificationEmail");

                        router.push("/login");
                    }catch(error: any){
                        console.log("VERIFY OTP ERROR: ",error);
                        setStatus({type:"error",message:error.response?.data?.message || "OTP verification Failed",});
                    }finally{
                        setSubmitting(false);
                    }
                }}
                >
                {({isSubmitting,status,setStatus,setSubmitting,})=>(
                    <Form className="space-y-4">
                        {/*OTP*/}
                        <div>
                            <label className="block mb-1">OTP</label>
                            <Field 
                            name="otp"
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            placeholder ="Enter 6-digit OTP"
                            className="w-full border rounded px-3 py-2"
                            />
                            <ErrorMessage
                            name="otp"
                            component="p"
                            className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        {/* API message */}
                        {status?.message && (<p className={status.type === "success"? "text-green-600": "text-red-500" }>
                            {status.message}
                        </p>)}

                        {/* VERIFY */}
                        <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 text-white py-2 rounded"
                        >{isSubmitting? "Verifying ": "Verify OTP"}</button>

                        {/* RESEND */}
                        <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={async ()=>{
                            try{
                                if(!email){
                                    setStatus({type: "error", message:"Email not Found. Please regster again.",
                                    });
                                    return;
                                }
                                setSubmitting(true);
                                const response = await api.post("/auth/resend-otp",{email,});
                                console.log("RESEND OTP RESPONSE: ",response.data);
                                setStatus({type:"success", message:response.data.message || "New OTP sent Successfully"});
                            }catch(error:any){
                                console.log("RESEND OTP ERROR: ",error);

                                setStatus({
                                    type: "error",
                                    message : error.response?.data?.message || "Failed to resend OTP"});
                            } finally{
                                setSubmitting(false);
                            }
                        }}
                        className="w-full border border-blue-600 text-blue-600 py-2 rounded" >
                            {isSubmitting ? "Sending..." : "Resend OTP"}
                        </button>
                        {/* BACK */}
                        <button 
                        type="button"
                        onClick={()=>router.push("/login")}
                        className="w-full text-grey-600 py-2">
                            Back To Login
                        </button>
                    </Form>
                )}
                </Formik>
            </div>
        </main>
    )
}
