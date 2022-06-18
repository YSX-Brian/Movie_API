const express = require('express'),
      morgan = require('morgan');

const app = express();

let topMovies = ['Movies'];

app.use(morgan('common'));
app.use(express.static('public'));

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.get('/', (req, res) => {
  res.send('Welcome to my app!');
});

app.get('/documentation.html', (req, res) => {
  res.sendFile('/documentation.html', { root: __dirname });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
