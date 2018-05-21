import * as files from '../../utils/files';
import { IMovie } from '../../tipes/tipes';

let movies: IMovie[];

export function load() {
  return new Promise((resolve, reject) => {
    files.readMovies()
      .then(data => {
        movies = JSON.parse(data);
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
    });
}

export function getMovies() {
  return movies;
}

export function getLikes() {
  const moviesLiked: IMovie[] = movies.filter((movie) => movie.likes > 0);
  return moviesLiked;
}

export function getMovie(movieId: number) {
  return movies.find((movie) => movie.id === movieId);
}

export function postMovie(newMovie: IMovie) {
  const lastMovieId = movies[movies.length - 1].id;
  newMovie.id = lastMovieId + 1;
  movies.push(newMovie);

  // Devuelvo la PROMESA y que se encargue el index
  return files.saveMovies(movies);
}

// Supongo que aqui va promise por devolver un solo tipo (promise)
export function putMovie(movieId: number, movieFromBody) {
  return new Promise((resolve, reject) => {
    const putMovieIndex = movies.findIndex((movie) => movie.id === movieId);

    if (putMovieIndex >= 0) {
      movies[putMovieIndex] = {
        ...movies[putMovieIndex],
        ...movieFromBody,
      };
      files.saveMovies(movies)
        .then(() => resolve(movies[putMovieIndex]))
        .catch(() => reject('Error guardando pelis'));
    } else {
      reject('Error modificando peli');
    }
  });
}

export function putLike(movieId: number) {
  return new Promise((resolve, reject) => {
    const putMovieIndex = movies.findIndex((movie) => movie.id === movieId);
    if (putMovieIndex >= 0) {
      movies[putMovieIndex].likes = (movies[putMovieIndex].likes || 0) + 1; // Si movies[] es undefined, sale 0

      files.saveMovies(movies)
        .then(() => resolve(movies[putMovieIndex]))
        .catch(() => reject('Error guardando pelis'));
    } else {
      reject('Error dando like');
    }
  });
}

export function deleteMovie(movieId: number) {
  return new Promise((resolve, reject) => {
    const deleteMovieIndex = movies.findIndex((movie) => movie.id === movieId);

    if (deleteMovieIndex >= 0) {
      const deletedMovie = movies.splice(deleteMovieIndex, 1);
      files.saveMovies(movies)
        .then(() => resolve(deletedMovie))
        .catch(() => reject('Error guardando pelis'));
    } else {
      reject('Error borrando peli. Id no existe');
    }
  });
}
