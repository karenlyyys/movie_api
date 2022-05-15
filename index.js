const express = require("express");
const res = require("express/lib/response");
      morgan = require('morgan');
const path = require("path")
const app = express();
const PORT = 8080; 
const uuid = require('uuid');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

const passport = require("passport")

mongoose.connect('mongodb+srv://karenlyyys:Popmusic2@cluster0.geg4q.mongodb.net/moviesdb', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());


// READ to return all movies to user
app.get('/movies', (req, res) => {
  Movies.findOne({"Movies.Name": req.params.movies}).then(movie => res.status(200).json(movie.movies));
});

//For returning data about a single movie
app.get('/movies/title/:title', (req, res) => {
  Movies.findOne({Title: req.params.title}).then(movie => res.status(200).json(movie));
});

//For returning data about a genre
app.get('/movies/genre/:genre', (req, res) => {
  Movies.findOne({"Genre.Name": req.params.genre}).then(movie => res.status(200).json(movie.Genre));
});

//For returning data about a director by name
app.get('/movies/director/:director', (req, res) => {
  Movies.findOne({"Director.Name": req.params.director}).then(movie => res.status(200).json(movie.Director));
});

//CREATE For allowing new users to register
app.post('/users/register', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//For allowing users to UPDATE their user info
// Update a user's info, by username
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//For allowing users to add a movie to their list of favorite movies
// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//For allowing users to remove a movie from their list of favorites movies-text
app.delete('/users/:Username/favorites/:MovieID', passport.authenticate ('jwt', { session: false }), 
(req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, 
      { $pull: { FavoriteMovies: req.params.MovieID }},
      { new: true },
     (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.status(200).json(updatedUser);
      }
  });
});

// Delete a user by username
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//GET request for returning the personal message
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

  //Using the Morgan middleware library to log all requests
app.use(morgan('common'));
app.use(express.json()); 

//Using express.static to serve the documentation.html file
app.use(express.static('public'));

//Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Oops!Something Went Wrong!');
  });

//Listen for request
app.listen(PORT, ()=>console.log("App is running"));



