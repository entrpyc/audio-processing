const ffmpeg = require('fluent-ffmpeg');
const { log } = require('./logger');

const processAudio = ({
  inputPath,
  outputPath,
  bitrate,
  filters,
  applyFilters
}) => new Promise((resolve, reject) => {
  log({
    inputPath,
    outputPath,
    bitrate,
    filters,
    applyFilters
  })
  ffmpeg(inputPath)
    .audioBitrate(bitrate)
    .audioChannels(1)
    .audioFrequency(22050)
    .outputOptions('-c:a libmp3lame', '-compression_level 5')
    .audioFilters(applyFilters ? filters : [])
    .on('end', () => {
      resolve();
    })
    .on('error', (err) => {
      console.error('FFmpeg error:', err);
      reject(new Error('FFmpeg processing failed'));
    })
    .save(outputPath);
});

module.exports = {
  processAudio
}