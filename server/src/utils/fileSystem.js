const fs = require('fs');

const readFile = (path) => {
  const file = fs.statSync(path);

  return file;
}

const deleteFile = (path) => {
  fs.unlinkSync(path);
}

const copyFile = (pathOrigin, pathDestination) => {
  fs.copyFileSync(pathOrigin, pathDestination);
}

const readAudio = (path) => {
  return fs.createReadStream(path)
}

const writeAudio = (path) => {
  return fs.createWriteStream(path)
}

const findFolder = (path) => {
  return fs.existsSync(path)
}

const createFolder = (path) => {
  fs.mkdirSync(path, { recursive: true })
}

const openFolder = (path, cb) => {
  fs.readdir(path, cb)
}

const deleteFileAsync = (path, cb) => {
  fs.unlink(path, cb)
}

module.exports = {
  readFile,
  deleteFile,
  readAudio,
  writeAudio,
  copyFile,
  findFolder,
  createFolder,
  openFolder,
  deleteFileAsync,
}