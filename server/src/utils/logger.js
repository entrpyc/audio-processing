const log = (...args) => {
  console.log(...args)
}

const logError = (...args) => {
  console.error(...args)
}

module.exports = {
  log,
  logError,
}