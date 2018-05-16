const express = require('express')
const app = express()
const moviesRouter = require('./src/api/movies')

app.use(express.json())
app.use('/movies', moviesRouter.router)

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