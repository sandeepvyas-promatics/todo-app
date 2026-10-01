import jwt from "jsonwebtoken";
const authMiddleware =(req,res,next)=>{
    try{
        const token = req.cookies.accessToken;
        if(!token){
            return res.status(401).json({
                message:"Authentication required"
            });
        }
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.user= decoded;
    console.log("AUTHENTICATED USER:", req.user);
    next();
    }catch(error){
        console.log(error);
        return res.status(401).json({message:"Invalid or expired token"});
    }
};

export default authMiddleware;