import * as fs from 'fs';
const filePath = '../../dataMovies.txt';

export function saveMovies(data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data), err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export function readMovies(): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.toString());
      }
    });
  });
}
