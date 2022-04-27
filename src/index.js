const express = require("express")
const path = require("path")
const app = express();
const PORT = 8080;

//Using the Morgan middleware library to log all requests
app.use(morgan('common'));
app.use(express.json()); 

app.get("/", (req, res)=>{
    res.send("welcome to my flix")
})

app.get("/documentation", (req, res)=>{
    res.sendFile(path.join(__dirname,'/public/documentation.html'));
})

//GET request for returning the JSON movie data
app.get('/movies', (req, res) => {
    res.json(movies);
});

//GET request for returning default response
app.get('/', (req, res) => {
    res.send('Welcome to the Top 10 Movies List!');
  });

//Using express.static to serve the documentation.html file
app.use(express.static('public'));

//Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Oops!Something Went Wrong!');
  });


app.listen(PORT, ()=>console.log("App is running"))