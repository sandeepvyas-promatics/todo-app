import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function proxy(request:NextRequest){
  const token = request.cookies.get("accessToken")?.value;

  const { pathname }= request.nextUrl;

  const isProtectedRoute= pathname.startsWith("/todos") || pathname.startsWith("/dashboard") || pathname.startsWith("/add-todo");

  const isAuthRoute= pathname === "/login" || pathname === "/register" || pathname === "/verify-otp";

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

export const config ={
  matcher : [
    "/dashboard/:path*",
    "/todos/:path*",
    "/add-todo/:path*",
    "/login",
    "/register",
    "/verify-otp",
  ],
};