const express = require('express');
const app = express();
app.use(express.json());

const movies = [
  {id: 1, name: "Peli 1"},
  {id: 2, name: "Peli 2"}
];

// GET ---------------------------------
app.get('/movies', (req, res) => {
  res.json(movies);
});

app.get('/movie/:id', (req, res) => {
  const movieId = req.params.id
  const movie = movies.find(movie => movie.id == movieId);

  if (movie != undefined) {
    res.json(movie)
  } else {
    res.send(404)
  }
});

// POST ------------------------------
app.post('/movies', (req, res) => {
  const newMovie = req.body
  const lastMovieId = movies[movies.length - 1].id
  newMovie.id = lastMovieId + 1
  movies.push(newMovie)
  res.json(newMovie)
});

// PUT --------------------------------
app.put('/movies', (req, res) => {
  const movieId = req.body.id
  const putMovieIndex = movies.findIndex(movie => movie.id == movieId);

  if (putMovieIndex >= 0) {
    movies[putMovieIndex] = {
      ...movies[putMovieIndex],
      ...req.body
    }
    res.json(movies[putMovieIndex])
  } else {
    res.send(404)
  }
});

app.put('/movie/like/:id', (req, res) => {
  const movieId = req.params.id
  const putMovieIndex = movies.findIndex(movie => movie.id == movieId);

  if (putMovieIndex >= 0) {
    // undefined + 1 = undefined 2maneras de arreglarlo
    movies[putMovieIndex].likes = (movies[putMovieIndex].likes || 0) + 1 // Si movies[] es undefined, sale 0
    // Lo mismo con if comprimido
    movies[putMovieIndex].likes = movies[putMovieIndex].likes ? movies[putMovieIndex].likes++ : 1;
  } else {
    res.send(404)
  }
});

// DELETE ----------------------------
app.delete('/movie/:id', (req, res) => {
  const movieId = req.params.id
  const deleteMovieIndex = movies.findIndex(movie => movie.id == movieId);

  if (deleteMovieIndex >= 0) {
    const removed = movies.splice(deleteMovieIndex, 1)
    res.json(removed)
  } else {
    res.send(404)
  }
});






































app.listen(3000, () => console.log('Ready on port 3000'))
