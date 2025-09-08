const { DEFAULT_NORMALIZATION } = require("./constants")

const getFilters = ({ normalization }) => {
  const removeSilence = true;

  const normalizeVolume = [
    'dynaudnorm',
    `volume=${normalization}`,
  ]

  const speechOptimization = [
    'highpass=f=200',
    'lowpass=f=6000',
    "firequalizer=gain_entry='entry(60, -20);entry(100, -15);entry(150, -10);entry(200, -5)'",
  ]

  const silenceRemoval = removeSilence
  ? [
      'silenceremove=start_periods=1:start_duration=5:start_threshold=-35dB:stop_periods=-1:stop_duration=5:stop_threshold=-35dB'
    ]
  : [];

  return [
    ...speechOptimization,
    ...normalizeVolume,
    // ...silenceRemoval,
  ]
}

module.exports = {
  getFilters,
}