import * as files from '../../utils/files';
import { MongoClient, Server, ObjectID } from 'mongodb';

const MONGO_URL = 'localhost:21017';

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

export function postMovie(newMovie) {
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
    MongoClient.connect(MONGO_URL, (err, client) => {
      if (!err) {
        const db = client.db('eoiMovies');
        const moviesCollection = db.collection('movies');

        const movieToUpdate = { ...movieFromBody, updated: new Date() };
        const query = { _id: new ObjectID(movieId)};
        const body = { $set: movieToUpdate };
        const options = { returnOrigonal: false, upsert: false };
        moviesCollection.findOneAndUpdate(query, body, options)
          .then(() => resolve())
          .catch(updateError => reject(updateError));
      } else {
        reject(err);
      }
    });
  });
}

export function putLike(movieId: number, likeValue: boolean) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(MONGO_URL, (err, client) => {
      if (!err) {
        const db = client.db('eoiMovies');
        const moviesCollection = db.collection('movies');

        const query = { _id: new ObjectID(movieId) };
        const body = { $set: { like: likeValue, updated: new Date() } };
        const options = { returnOrigonal: false, upsert: false };
        moviesCollection.findOneAndUpdate(query, body, options)
          .then(() => resolve())
          .catch(updateError => reject(updateError));
      } else {
        reject(err);
      }
    });
  });
}

export function deleteMovie(movieId: number) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(MONGO_URL, (err, client) => {
      const db = client.db('eoiMovies');
      const moviesCollection = db.collection('movies');

      const query = { _id: new ObjectID(movieId) };
      moviesCollection.findOneAndDelete(query)
        .then(() => resolve())
        .catch((deleteError => reject(deleteError)));
    });
  });
}