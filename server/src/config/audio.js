const { DEFAULT_NORMALIZATION } = require("./constants")

const getFilters = ({ normalization }) => {
  const normalizeVolume = [
    'dynaudnorm',
    `volume=${normalization}`,
  ]

  const speechOptimization = [
    'highpass=f=200',
    'lowpass=f=6000',
    "firequalizer=gain_entry='entry(60, -20);entry(100, -15);entry(150, -10);entry(200, -5)'",
  ]

  return [
    ...speechOptimization,
    ...normalizeVolume,
  ]
}

module.exports = {
  getFilters,
}