const logger = (req,res,next)=>{
    console.log("REQUEST RECEIVE");
    console.log("METHOD: ",req.method);
    console.log("URL: ",req.url);
    next();
}
export default logger;