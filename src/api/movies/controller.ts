import * as files from '../../utils/files';
import { IMovie } from '../../tipes/tipes';
import { MongoClient, Server, ObjectID } from 'mongodb';

const MONGO_URL = 'localhost:21017';
const movies: IMovie[] = [];

// export function load() {
//   return new Promise((resolve, reject) => {
//     files.readMovies()
//       .then(data => {
//         movies = JSON.parse(data);
//         resolve();
//       })
//       .catch((err) => {
//         reject(err);
//       });
//     });
// }

export function getMovies() {
  return new Promise((resolve, reject) => {
    MongoClient.connect(MONGO_URL, (err, client) => {
      if (!err) {
        const db = client.db('eoiMovies');
        const moviesCollection = db.collection('movies');

        moviesCollection.find({}).limit(20).toArray()
          .then(movies => resolve(movies))
          .catch(errorQuery => reject(errorQuery));
      } else {
        reject(err);
      }
    });
  });
}

export function getLikes() {
  return new Promise((resolve, reject) => {
    MongoClient.connect(MONGO_URL, (err, client) => {
      if (!err) {
        const db = client.db('eoiMovies');
        const moviesCollection = db.collection('movies');

        moviesCollection.find({ like: true }).limit(20).toArray()
          .then(movies => resolve(movies))
          .catch(err => reject(err));
      } else {
        reject(err);
      }
    });
  });
}

export function getMovie(movieId: number) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(MONGO_URL, (err, client) => {
      if (!err) {
        const db = client.db('eoiMovies');
        const moviesCollection = db.collection('movies');

        moviesCollection.findOne({ _id: new ObjectID(movieId)})
          .then(movie => resolve(movie))
          .catch(errorFind => reject(errorFind));
      } else {
        reject(err);
      }
    });
  });
}

export function postMovie(newMovie: IMovie) {
  return new Promise((resolve, reject) => {
    const movieToInsert = {...newMovie, created: new Date(), updated: new Date() };
    MongoClient.connect(MONGO_URL, (err, client) => {
      if (!err) {
        const db = client.db('eoiMovies');
        const moviesCollection = db.collection('movies');

        moviesCollection.insertOne(movieToInsert)
          .then(() => resolve(movieToInsert))
          .catch(errorInsert => reject(errorInsert));
      } else {
        reject(err);
      }
    });
  });
}

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
