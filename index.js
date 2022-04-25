const express = require("express")

const app = express();
const PORT = 8080;

app.get("/", (req, res)=>{
    res.send("welcome to my flix")
})

app.get("/register", (req, res)=>{
    res.send("register")
})

app.listen(PORT, ()=>console.log("App is running"))