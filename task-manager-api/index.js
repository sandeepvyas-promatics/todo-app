const express= require("express")
const app= express();
app.use(express.json());
app.get("/tasks",(req,res)=>{
    console.log(req.url);
    console.log(req.method);
    res.send("hello i m tired");
})
app.post()
app.listen(4000,()=>{
    console.log("server is running at port 4000");
})