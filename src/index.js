const express = require("express")
const path = require("path")
const app = express();
const PORT = 8080;

app.get("/", (req, res)=>{
    res.send("welcome to my flix")
})

app.get("/documentation", (req, res)=>{
    res.sendFile(path.join(__dirname,'/public/documentation.html'));
})

app.listen(PORT, ()=>console.log("App is running"))