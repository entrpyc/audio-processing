const ffmpeg = require('fluent-ffmpeg');

const processAudio = ({
  inputPath,
  outputPath,
  bitrate,
  filters,
  applyFilters
}) => new Promise((resolve, reject) => {
  ffmpeg(inputPath)
    .audioBitrate(bitrate)
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