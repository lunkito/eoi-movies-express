import * as express from 'express';
import * as controller from './controller';

export const router = express.Router();

//#region GET --------------------------------
router.get('/', (req, res) => {
  console.log('Entra a /');
  controller.getMovies()
    .then(movies => res.json(movies))
    .catch(err => res.status(500).send(err));
});

router.get('/likes', (req, res) => {
  controller.getLikes()
    .then(movies => res.json(movies))
    .catch(err => res.status(500).send(err));
});

router.get('/:id', (req, res) => {
  controller.getMovie(req.params.id)
    .then(movie => res.json(movie))
    .catch(err => res.status(500).send(err));
});
//#endregion

//#region POST -------------------------------
router.post('/', (req, res) => {
  const newMovie = req.body;

  controller.postMovie(newMovie)
    .then(() => res.json(newMovie))
    .catch(() => res.status(500).send('No se guardo la peli'));
});
//#endregion

//#region PUT --------------------------------
router.put('/', (req, res, next) => {
  const movieId = req.body.id;

  controller.putMovie(movieId, req.body)
    .then(movie => res.send(movie))
    .catch(err => next(err));
});

router.put('/like/:id', (req, res, next) => {
  const movieId = req.params.id;

  controller.putLike(movieId, true)
    .then(movie => res.send(movie))
    .catch(err => next(err));
});
//#endregion

//#region DELETE ----------------------------
router.delete('/:id', (req, res) => {
  const movieId = req.params.id;

  controller.deleteMovie(movieId)
    .then(movie => res.send(movie))
    .catch(err => res.status(404).send(err));
});
//#endregion
