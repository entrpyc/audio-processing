const ffmpeg = require('fluent-ffmpeg');
const { log, logError } = require('./logger');

const processAudio = ({
  inputPath,
  outputPath,
  bitrate,
  filters,
  applyFilters
}) => new Promise((resolve, reject) => {
  ffmpeg(inputPath)
    .audioBitrate(bitrate)
    .audioChannels(1)
    .audioFrequency(16000)
    .audioCodec('libmp3lame')
    .outputOptions('-compression_level 5')
    .audioFilters(applyFilters ? filters : [])
    .on('end', () => {
      resolve();
    })
    .on('error', (err) => {
      logError('FFmpeg error:', err);
      reject(new Error('FFmpeg processing failed'));
    })
    .save(outputPath);
});

module.exports = {
  processAudio
}