const express = require("express")
      morgan = require('morgan');
const path = require("path")
const app = express();
const PORT = 8080

let movies = [
  {
    title: 'Inception',
    director: 'Christopher Nolan',
    genre: 'Sci-Fi'
  },
  {
    title: 'Lord of the Rings',
    director: 'Peter Jackson',
    genre: 'Super-Heroes'
  },
  {
    title: 'The Matrix',
    director: 'Lana Wachowski',
    genre: 'Sci-fi'
  },
  {
      title: 'The Avengers',
      director: 'Anthony Russo',
      genre: 'Super-Heroes'
    },
    {
      title: 'The Silence Of The Lambs',
      director: 'Jonathan Demme',
      genre: 'Suspense-Thriller'
    },
    {
      title: 'Terminator',
      director: 'James Cameron',
      genre: 'Action'
    },
    {
      title: 'The Prestige',
      director: 'Christopher Nolan',
      genre: 'Suspense-Thriller'
    },
    {
      title: 'Shutter Island',
      director: 'Martin Scorsese',
      genre:'Suspense-Thriller'
    },
    {
      title: 'The Fugitive',
      director: 'Andrew Davis',
      genre: 'Suspense-Thriller'
    },
    {
      title: 'The Shack',
      director: 'Stuart Hazeldine',
      genre: 'Feel-Good'
    }
];

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

//Listen for request
app.listen(PORT, ()=>console.log("App is running"));



