import * as express from 'express';
import * as controller from './controller';

export const router = express.Router();

export function load() {
  return new Promise((resolve, reject) => {
    controller.load()
      .then(resolve);
  });
}

//#region GET --------------------------------
router.get('/', (req, res) => {
  if (req.session.views === null || req.session.views === undefined) {
    req.session.views = 1;
    console.log('req.session.views == null', req.session);
    res.json(controller.getMovies());
  } else {
    console.log('req.session.views != null', req.session);
    res.send('Paga la coca, primer aviso');
  }
});

router.get('/likes', (req, res) => {
  res.json(controller.getLikes());
});

router.get('/:id', (req, res) => {
  const movie = controller.getMovie(req.params.id);

  if (movie !== undefined) {
    res.json(movie);
  } else {
    res.status(404).send('Id no valido');
  }
});
//#endregion

//#region POST -------------------------------
router.post('/', (req, res) => {
  const newMovie = req.body;

  // Esperar a que se guarde el fichero antes de responder
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

  controller.putLike(movieId)
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
