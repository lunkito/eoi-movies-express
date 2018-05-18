const files = require('../../utils/files')

let movies;

function load() {
  return new Promise((resolve, reject) => {
    files.readMovies()
      .then((data) => {
        movies = JSON.parse(data)
        resolve()
      })
      .catch((err) => {
        reject(err)
      });
    })
}

function getMovies() {
  return movies
}

function getLikes() {
  let moviesLiked = movies.filter(movie => movie.likes > 0)
  return moviesLiked
}

function getMovie(movieId) {
  return movies.find(movie => movie.id == movieId)
}

function postMovie(newMovie) {
  const lastMovieId = movies[movies.length - 1].id
  newMovie.id = lastMovieId + 1
  movies.push(newMovie)

  // Devuelvo la PROMESA y que se encargue el index
  return files.saveMovies(movies)
}

// Supongo que aqui va promise por devolver un solo tipo (promise)
function putMovie(movieId, movie) {
  return new Promise((resolve, reject) => {
    const putMovieIndex = movies.findIndex(movie => movie.id == movieId);

    if (putMovieIndex >= 0) {
      movies[putMovieIndex] = {
        ...movies[putMovieIndex],
        ...movie
      }
      files.saveMovies(movies)
        .then(() => resolve(movies[putMovieIndex]))
        .catch(() => reject('Error guardando pelis'))
    } else {
      reject('Error modificando peli')
    }
  })
}

function putLike(movieId) {
  return new Promise((resolve, reject) => {
    const putMovieIndex = movies.findIndex(movie => movie.id == movieId);
    if (putMovieIndex >= 0) {
      movies[putMovieIndex].likes = (movies[putMovieIndex].likes || 0) + 1 // Si movies[] es undefined, sale 0
  
      files.saveMovies(movies)
        .then(() => resolve(movies[putMovieIndex]))
        .catch(() => reject('Error guardando pelis'))
    } else {
      reject('Error dando like')
    }
  })
}

function deleteMovie(movieId) {
  return new Promise((resolve, reject) => {
    const deleteMovieIndex = movies.findIndex(movie => movie.id == movieId);
  
    if (deleteMovieIndex >= 0) {
      const deletedMovie = movies.splice(deleteMovieIndex, 1)
      files.saveMovies(movies)
        .then(() => resolve(deletedMovie))
        .catch(() => reject('Error guardando pelis'))
    } else {
      reject('Error borrando peli. Id no existe')
    }
  })
}


module.exports = {
  getLikes,
  getMovie,
  getMovies,
  postMovie,
  putMovie,
  deleteMovie,
  putLike,
  load
};
