const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const { defaultAudioFilters } = require("../config/audio.js");
const { uploadToTelegram, downloadFile } = require("./uploadService.js.js");
const { compressBitrate } = require('../utils/audioProcessing.js');

const audioProcessor = async ({
  fileData,
  res,
  sendToTelegramFlag,
}) => {
  const {
    inputPath,
    title,
    fileName,
    outputPath,
    fileSize
  } = fileData;

  ffmpeg(inputPath)
    .audioBitrate(compressBitrate(fileSize))
    .audioFilters(defaultAudioFilters)
    .on('end', async () => {
      const stats = fs.statSync(outputPath);
      const compressedFileSize = stats.size / (1024 * 1024);

      if(!sendToTelegramFlag) await downloadFile({ outputPath, res });
      else await uploadToTelegram({ fileSize: compressedFileSize, outputPath, fileName, title });

      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    })
    .on('error', err => {
      console.error('FFmpeg error:', err);
      res.status(500).json({ error: 'FFmpeg processing failed' });
    })
    .save(outputPath);
}

module.exports = {
  audioProcessor
}