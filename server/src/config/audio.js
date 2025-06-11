const volumeCompression = [
  'dynaudnorm',
  'volume=2.2',
]

const speechOptimization = [
  'highpass=f=200',
  'lowpass=f=6000',
  "firequalizer=gain_entry='entry(60, -20);entry(100, -15);entry(150, -10);entry(200, -5)'",
]

module.exports = {
  speechOptimization,
  volumeCompression
}