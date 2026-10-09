import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function proxy(request:NextRequest){
  const token = request.cookies.get("accessToken")?.value;

  const { pathname }= request.nextUrl;

  const isProtectedRoute= pathname.startsWith("/todos") || pathname.startsWith("/dashboard") || pathname.startsWith("/add-todo");

  const isAuthRoute= pathname === "/login" || pathname === "/register" || pathname === "/verify-otp"  || pathname === "/forgot-password" || pathname === "/reset-password";

  //User is not logged in
  if(!token && isProtectedRoute){
    return NextResponse.redirect(new URL("/login",request.url));
  }

  // User IS logged in 
  if(token && isAuthRoute){
    return NextResponse.redirect(new URL("/todos",request.url));
  }
return NextResponse.next();
}

export const config = {
    matcher: [
        "/todos",
        "/todos/:path*",
        "/dashboard",
        "/dashboard/:path*",
        "/add-todo",
        "/add-todo/:path*",
        "/login",
        "/register", 
        "/verify-otp",
        "/reset-password",
        "/forgot-password",
    ],
};