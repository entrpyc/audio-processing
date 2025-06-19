const fs = require('fs');
const { getFileData } = require('../utils/formatting');
const { ROUTE } = require('../config/constants');
const { Readable } = require('stream');
const { pipeline } = require('stream/promises');
const { audioProcessor } = require('../services/audioProcessingService.js');

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

    const fileData = getFileData({ ...fileStats, path: uploadPath }, reqTitle, reqDate);

    if(sendToTelegramFlag) res.status(200).json({
      status: 'Uploaded! The recording will be posted to Telegram once its ready'
    });

    audioProcessor({
      fileData,
      res,
      sendToTelegramFlag,
    });

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Server crashed' });
  }
}

module.exports = {
  processZoomRecordingController
}