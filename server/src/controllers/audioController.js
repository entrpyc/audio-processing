const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const { sendAudioToTelegram, sendDocumentToTelegram } = require('../services/telegramService');
const { compressBitrate } = require('../utils/audioProcessing');
const { normalizeVolume, speechOptimization } = require('../config/audio');
const { getFileData } = require('../utils/formatting');
const { TELEGRAM_AUDIO_SIZE_LIMIT } = require('../config/constants');

async function audioController(req, res) {
  try {
    const { name: reqName, date: reqDate, sendToTelegram: sendToTelegramFlag } = req.body;

    console.log(req.body)

    if (!req.file || !reqName || !reqDate) {
      return res.status(400).send('Missing file, name, or date');
    }

    const {
      inputPath,
      title,
      fileName,
      outputPath,
      fileSize
    } = getFileData(req.file, reqName, reqDate);

    if(sendToTelegramFlag === 'true') res.status(200).send('Uploaded! The recording will be posted to Telegram once its ready');

    ffmpeg(inputPath)
      .audioBitrate(compressBitrate(fileSize))
      .audioFilters([
        ...speechOptimization,
        ...normalizeVolume,
      ])
      .on('end', async () => {
        const stats = fs.statSync(outputPath);
        const compressedFileSize = stats.size / (1024 * 1024);

        if(sendToTelegramFlag === 'false') {
          res.download(outputPath, (err) => {
            if (err) {
              return res.status(500).send('Download failed');
            }

            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);
          });
        } else {
          try {
            if(compressedFileSize > TELEGRAM_AUDIO_SIZE_LIMIT) await sendDocumentToTelegram(outputPath, fileName);
            else await sendAudioToTelegram(outputPath, title);
          } catch (err) {
            console.error('Telegram upload failed:', err);
          } finally {
            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);
          }
        }
      })
      .on('error', err => {
        console.error('FFmpeg error:', err);
        res.status(500).send('FFmpeg processing failed');
      })
      .save(outputPath);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).send('Server crashed');
  }
}

module.exports = {
  audioController
}