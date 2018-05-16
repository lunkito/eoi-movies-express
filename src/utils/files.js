module.exports = {
    saveMovies,
    readMovies
}

const fs = require('fs')
const filePath = './dataMovies.txt'

function saveMovies(data){
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, data, err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    }) 
  }
  
  function readMovies() {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          reject(err)
        } else {
          console.log(data.toString());
          
          resolve(data.toString())
        }
      })
    })
  }