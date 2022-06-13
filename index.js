const express = require("express");
var cors = require('cors')
const res = require("express/lib/response");
      morgan = require('morgan');
const path = require("path")
const app = express();
app.use(cors())
const PORT = process.env.PORT || 8080; 
const uuid = require('uuid');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb+srv://karenlyyys:Popmusic2@cluster0.geg4q.mongodb.net/moviesdb', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

//Using express.static to serve the documentation.html file
app.use(express.static('public'));

//GET request for returning the personal message
app.get("/", (req, res)=>{
  res.send("welcome to my flix")
})

app.get("/documentation", (req, res)=>{
  res.sendFile(path.join(__dirname,'/public/documentation.html'));
})

//Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Oops!Something Went Wrong!');
});

// READ to return all movies to user
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find().then(movies => res.status(200).json(movies));
});

//For returning data about a single movie
app.get('/movies/title/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({Title: req.params.title}).then(movie => res.status(200).json(movie));
});

//For returning data about a genre
app.get('/movies/genre/:genre', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({"Genre.Name": req.params.genre}).then(movie => res.status(200).json(movie.Genre));
});

//For returning data about a director by name
app.get('/movies/director/:director', passport.authenticate('jwt', { session: false }),  (req, res) => {
  Movies.findOne({"Director.Name": req.params.director}).then(movie => res.status(200).json(movie.Director));
});

//CREATE For allowing new users to register
app.post('/users/register', (req, res) => {
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });

});
//test from here
//For allowing users to UPDATE their user info
// Update a user's info, by username
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
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

//For users to add movies to favorites list
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.delete('/users/:Username/movies/:MovieID', passport.authenticate ('jwt', { session: false }), 
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
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
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

//Listen for request
app.listen(PORT, ()=>console.log("App is running"));



