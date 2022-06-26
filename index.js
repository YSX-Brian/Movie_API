const express = require('express'),
      morgan = require('morgan'),
      fs = require('fs'),
      path = require('path'),
      bodyParser = require('body-parser');
      uuid = require('uuid');

const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

//example user data
let users = [
    {
        id: 1,
        name: "Billy",
        favoriteMovies: []
    },
    {
        id: 2,
        name: "Sara",
        favoriteMovies: []
    }
];

//example movie data
let movies = [
    {
        Title: "Title",
        Description: "Description",
        Genre: {
            Name: "GenreName",
            Description: "GenreDescription"
        },
        Director: {
            Name: "DirectorName",
            Bio: "DirectorBio"
        }
    },
    {
        Title: "Title2",
        Description: "Description2",
        Genre: {
            Name: "GenreName2",
            Description: "GenreDescription2"
        },
        Director: {
            Name: "DirectorName2",
            Bio: "DirectorBio2"
        }
    }
];

app.use(morgan('combined', {stream: accessLogStream}));
app.use(bodyParser.json());
app.use(express.static('public'));

//return a list of all movies
app.get('/movies', (req, res) => {
    res.json(movies);
});

//return data on a single movie by search
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find( movie => movie.Title === title );

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('Movie not found.');
    }
});

//return data on a single genre by search
app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find( movie => movie.Genre.Name === genreName ).Genre;

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send('Genre not found.');
    }
});

//return data on a single director by search
app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find( movie => movie.Director.Name === directorName ).Director;

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('Director not found.');
    }
});

//add a new user
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser);
    } else {
        res.status(400).send('User name required.');
    }
});

//update a user name
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;
    let user = users.find( user => user.id == id );

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('User not found.');
    }
});

//add a new favorite movie for a user
app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to ${user.name}'s list.`);
    } else {
        res.status(400).send('User not found.');
    }
});

//delete a movie for a user
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
    let user = users.find( user => user.id == id );

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from ${user.name}'s list.`);
    } else {
        res.status(400).send('User not found.');
    }
});

//deregister a user
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    let user = users.find( user => user.id == id );

    if (user) {
        users = users.filter( user => user.id != id);
        res.status(200).send(`${user.name} has deregistered.`);
    } else {
        res.status(400).send('User not found.');
    }
});

//get documentation
app.get('/documentation.html', (req, res) => {
  res.sendFile('/documentation.html', { root: __dirname });
});

//for errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
