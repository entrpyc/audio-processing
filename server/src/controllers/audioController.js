const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const { sendAudioToTelegram, sendDocumentToTelegram } = require('../services/telegramService');
const { compressBitrate } = require('../utils/audioProcessing');
const { volumeCompression, speechOptimization } = require('../config/audio');
const { getFileData } = require('../utils/formatting');
const { TELEGRAM_AUDIO_SIZE_LIMIT } = require('../config/constants');

async function audioController(req, res) {
  try {
    const { name: reqName, date: reqDate, sendToTelegram: sendToTelegramFlag } = req.body;
    if (!req.file || !reqName || !reqDate) {
      return res.status(400).send('Missing file, name, or date');
    }

    const {
      inputPath,
      fileSize,
      title,
      fileName,
      outputPath
    } = getFileData(req.file, reqName, reqDate);

    ffmpeg(inputPath)
      .audioBitrate('320k')
      .audioFilters([
        ...volumeCompression,
        ...speechOptimization,
      ])
      .on('end', async () => {
        const stats = fs.statSync(outputPath);
        const compressedFileSize = stats.size / (1024 * 1024);

        if(sendToTelegramFlag === 'false') {
          res.download(outputPath, fileName, () => {
            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);
          });
        } else {
          try {
            if(compressedFileSize > TELEGRAM_AUDIO_SIZE_LIMIT) await sendDocumentToTelegram(outputPath, fileName);
            else await sendAudioToTelegram(outputPath, title);
            res.send('Uploaded to Telegram');
          } catch (err) {
            console.error('Telegram upload failed:', err);
            res.status(500).send('Telegram upload failed');
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