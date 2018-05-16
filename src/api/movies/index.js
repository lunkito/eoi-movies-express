const express = require('express')
const router = express.Router()
const controller = require('./controller')
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
        console.log(err)
        reject(err)
      });
    })
}

// files.readMovies()
//   .then((data) => movies = JSON.parse(data))
//   .catch((err) => console.log('No se pudo leer el fichero de movies -> ', err));


//#region GET ----------------------------
router.get('/', (req, res) => {
  res.json(movies);
  // controller.getMovies()
});

router.get('/like', (req, res) => {
    const likeMovies = movies.find(movie => movie.likes > 0)
    res.json(likeMovies)
  })

router.get('/:id', (req, res) => {
  const movieId = req.params.id
  const movie = movies.find(movie => movie.id == movieId);

  if (movie != undefined) {
    res.json(movie)
  } else {
    res.send(404)
  }
});

//#endregion

// POST ------------------------------
router.post('/', (req, res) => {
  const newMovie = req.body
  const lastMovieId = movies[movies.length - 1].id
  newMovie.id = lastMovieId + 1
  movies.push(newMovie)

  // Esperar a que se guarde el fichero antes de responder
  files.saveMovies(JSON.stringify(movies))
    // Dentro de un then siempre una funcion, sino ejecuta lo de dentro antes de que termine el then
    .then(() => res.json(newMovie))
    .catch(() => res.status(500).send('No se guardo la peli'));
});

// PUT --------------------------------
router.put('/', (req, res) => {
  const movieId = req.body.id
  const putMovieIndex = movies.findIndex(movie => movie.id == movieId);

  if (putMovieIndex >= 0) {
    movies[putMovieIndex] = {
      ...movies[putMovieIndex],
      ...req.body
    }

    files.saveMovies(JSON.stringify(movies))
      .then(() => res.json(movies[putMovieIndex]))
      .catch(() => res.status(500).send('No se pudo modificar la peli'))
    
  } else {
    res.status(404).send('Error')
  }
});

router.put('/like/:id', (req, res) => {
  const movieId = req.params.id
  const putMovieIndex = movies.findIndex(movie => movie.id == movieId);

  if (putMovieIndex >= 0) {
    movies[putMovieIndex].likes = (movies[putMovieIndex].likes || 0) + 1 // Si movies[] es undefined, sale 0

    files.saveMovies(JSON.stringify(movies))
      .then(() => res.send(movies[putMovieIndex]))
      .catch(() => res.status(500).send('No se pudo dar like'))
  } else {
    res.status(404).send('Error al buscar pelis con likes')
  }
});

// DELETE ----------------------------
router.delete('/:id', (req, res) => {
  const movieId = req.params.id
  const deleteMovieIndex = movies.findIndex(movie => movie.id == movieId);

  if (deleteMovieIndex >= 0) {
    const removed = movies.splice(deleteMovieIndex, 1)
    files.saveMovies(JSON.stringify(movies))
      .then(() => res.json(removed))
      .catch(() => res.status(500).send('No se borrar la peli'))
  } else {
    res.send(404)
  }
});

module.exports = {
  router,
  load
}

// // RAUL ---------------------
// router.get('/like', (req, res) => {
//   res.json(controller.getLikes());
// });

// router.get('/:id', (req, res) => {
//   res.json(controller.getMovie(req.params.id));
// });

// router.get('/', (req, res) => {
//   res.json(controller.getMovies());
// });

// router.post('/', (req, res) => {
//   const movie = req.body;
//   controller.newMovie(movie, (err, movies) => {
//     if (err) {
//       res.error(err);
//     } else {
//       res.json(movies);
//     }
//   });
// });

// router.put('/', (req, res) => {
//   controller.updateMovie(req.body, (err, movies) => {
//     if (err) {
//       res.error(err);
//     } else {
//       res.json(movies);
//     }
//   });
// });

// router.delete('/:id', (req, res) => {
//   controller.deleteMovie(req.params.id, (err, movies) => {
//     if (err) {
//       res.error(err);
//     } else {
//       res.json(movies);
//     }
//   });
// });

// router.post('/like/:id', (req, res) => {
//   controller.setLikeMovie(req.params.id, true, (err, movies) => {
//     if (err) {
//       res.error(err);
//     } else {
//       res.json(movies);
//     }
//   });
// });

// router.delete('/like/:id', (req, res) => {
//   controller.setLikeMovie(req.params.id, false, (err, movies) => {
//     if (err) {
//       res.error(err);
//     } else {
//       res.json(movies);
//     }
//   });
// });

// // fin RAUL ----------------------