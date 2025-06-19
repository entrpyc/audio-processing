const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const { sendAudioToTelegram, sendDocumentToTelegram } = require('../services/telegramService');
const { compressBitrate } = require('../utils/audioProcessing');
const { normalizeVolume, speechOptimization } = require('../config/audio');
const { getFileData } = require('../utils/formatting');
const { TELEGRAM_AUDIO_SIZE_LIMIT, ROUTE } = require('../config/constants');
const path = require('path');
const { downloadZoomRecording } = require('../services/zoomService');
const { Readable } = require('stream');
const { pipeline } = require('stream/promises');
const mime = require('mime-types');

async function processZoomRecordingController(req, res) {
  try {
    const {
      title: reqTitle,
      date: reqDate,
      downloadUrl: downloadUrl,
      sendToTelegram: sendToTelegramFlag,
    } = req.body;

    if (!reqTitle || !reqDate || !downloadUrl) {
      return res.status(400).json({ error: 'Missing title, date, or downloadUrl' });
    }

    const uploadPath = `${ROUTE.SYSTEM.UPLOADS}/input_${Date.now()}.m4a`;
    const response = await fetch(downloadUrl);
    const nodeStream = Readable.fromWeb(response.body);

    await pipeline(
      nodeStream,
      fs.createWriteStream(uploadPath)
    );

    const fileStats = fs.statSync(uploadPath);

    const {
      inputPath,
      title,
      fileName,
      outputPath
    } = getFileData({ ...fileStats, path: uploadPath }, reqTitle, reqDate);

    if(sendToTelegramFlag) res.status(200).json({
      status: 'Uploaded! The recording will be posted to Telegram once its ready'
    });

    ffmpeg(inputPath)
      .audioBitrate('64k')
      .audioFilters([
        ...normalizeVolume,
        ...speechOptimization,
      ])
      .on('end', async () => {
        const stats = fs.statSync(outputPath);
        const compressedFileSize = stats.size / (1024 * 1024);

        if(!sendToTelegramFlag) {
          res.download(outputPath, (err) => {
            if (err) {
              return res.status(500).json({ error: 'Download failed' });
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
        res.status(500).json({ error: 'FFmpeg processing failed' });
      })
      .save(outputPath);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Server crashed' });
  }
}

module.exports = {
  processZoomRecordingController
}