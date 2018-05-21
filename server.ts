import * as express from 'express';
import * as moviesRouter from './src/api/movies';
import * as compression from 'compression';
import * as session from 'express-session';
import * as morgan from 'morgan';
import * as methodOverride from 'method-override';
import * as notifier from 'node-notifier';
import * as request from 'superagent';
const app = express();

app.use(morgan('combined'));
app.use(compression());
app.use(session({ secret: '1234' }));
app.use(express.json());
app.use('/movies', moviesRouter.router);

function loadData() {
  return Promise.all([
    moviesRouter.load(),
  ]);
}

// Las function de los middleware tienes 2, 3 o 4 parametros. Siempre los mismos.
// Se usan con app.use
const errorHandler = (error, req, res, next) => {
  if (!error) {
    return next();
  }
  const message = `Error en ${req.method}, en la URL: ${req.url}`;
  notifier.notify({ title: 'Error', message: error.toString()});
  res.status(500).send('Algo se ha roto');
};

function errorSlack(err, req, res, next) {
  if (!err) {
    return next();
  }
  const errorMes = { text: `Error in ${req.method} ${req.url}`, username: 'monkey-bot', icon_emoji: ':cara_de_mono:'};
  request
    .post('https://hooks.slack.com/services/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')
    .send(errorMes)
    .end((error) => {
      next(error);
    });
}

app.use(methodOverride());
app.use(errorHandler);

loadData()
.then(() => {
  app.listen(3000, () => console.log('Ready on port 3000'));
})
.catch(() => console.log('No se pudo lanzar el servidor'));
