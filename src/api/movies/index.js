const express = require('express')
const router = express.Router()
const controller = require('./controller')



function load() {
  return new Promise((resolve, reject) => {
    controller.load()
      .then(resolve)
  })
}

//#region GET --------------------------------
router.get('/', (req, res) => {
  res.json(controller.getMovies());
});

router.get('/likes', (req, res) => {
  res.json(controller.getLikes())
})

router.get('/:id', (req, res) => {
  const movie = controller.getMovie(req.params.id)  

  if (movie != undefined) {
    res.json(movie)
  } else {
    res.status(404).send('Id no valido')
  }
});
//#endregion

//#region POST -------------------------------
router.post('/', (req, res) => {
  const newMovie = req.body

  // Esperar a que se guarde el fichero antes de responder
  controller.postMovie(newMovie)
    .then(() => res.json(newMovie))
    .catch(() => res.status(500).send('No se guardo la peli'))
});
//#endregion

//#region PUT --------------------------------
router.put('/', (req, res) => {
  const movieId = req.body.id

  controller.putMovie(movieId, req.body)
    .then((movie) => res.send(movie))
    .catch((err) => res.status(500).send(err))
});

router.put('/like/:id', (req, res) => {
  const movieId = req.params.id

  controller.putLike(movieId)
    .then((movie) => res.send(movie))
    .catch((err) => res.statusCode(404).send(err))
});
//#endregion

//#region DELETE ----------------------------
router.delete('/:id', (req, res) => {
  const movieId = req.params.id

  controller.deleteMovie(movieId)
    .then((movie) => res.send(movie))
    .catch((err) => res.statusCode(404).send(err))
});
//#endregion

module.exports = {
  router,
  load
}
