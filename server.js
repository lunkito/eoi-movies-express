const express = require('express')
const app = express()
const moviesRouter = require('./src/api/movies')

// ERROR HANDLER
const methodOverride = require('method-override')
const notifier = require('node-notifier')
app.use(methodOverride()) // Dependencia de notifier?
app.use(errorHandler)

// COMPRESSION
const compression = require('compression')
app.use(compression())

// EXPRESS SESSION
const session = require('express-session')
app.use(session({ secret: '1234' }))
  
app.use(express.json())
app.use('/movies', moviesRouter.router)

// Las function de los middleware tienes 2, 3 o 4 parametros. Siempre los mismos.
// Se usan con app.use
//#region MIDDLEWARE

function errorHandler(err, req, res, next) {
  if(!err) { return next() }

  const message = `Error en ${req.method} -> ${req.url}`
  notifier.notify({
      title: 'Error',
      message: message
    })
  res.send('Error')
}


//#endregion


function loadData() {
  return Promise.all([
    moviesRouter.load()
  ])
}

loadData()
  .then(() => {
    app.listen(3000, () => console.log('Ready on port 3000'))    
  })
  .catch(() => console.log('No se pudo lanzar el servidor'))
// app.listen(3000, () => console.log('Ready on port 3000'))