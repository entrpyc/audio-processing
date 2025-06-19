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

const zoomDownload = 'https://us06web.zoom.us/rec/download/1ouERwJFDojVpZv2H09nPMPKXtenKDn8R59GAiSPffLKvkwSijM4mS_a0YC8BGC4HM9Z06I5H3dBmyLE.1ZzVavGMje1I40HG?access_token=eyJzdiI6IjAwMDAwMiIsImFsZyI6IkhTNTEyIiwidiI6IjIuMCIsImtpZCI6ImI0ZjllMWYzLWY0YmMtNDA5OS05NDIwLTk2MGNmNzk5OWUzYyJ9.eyJhdWQiOiJodHRwczovL29hdXRoLnpvb20udXMiLCJ1aWQiOiJ1d1M0NERHMVJhNjlLcTg5UmZXV0pRIiwidmVyIjoxMCwiYXVpZCI6ImRlMGFhNDIwODgxN2JiNWIzN2E0OGE5MWY1ZmY3OWQ1NGIzZDhkMTVmN2QwZjhjZTY1YzI3MDE5NTYzYzZhYjAiLCJuYmYiOjE3NTAyODc2NTQsImNvZGUiOiJTbVRyVGVBTFRocTAtN3NORUxnV0RROTlyTVFNbEZibEQiLCJpc3MiOiJ6bTpjaWQ6RzNPNDVNR3JTeEtXTWNCNFUxVjlmQSIsImdubyI6MCwiZXhwIjoxNzUwMjkxMjU0LCJ0eXBlIjozLCJpYXQiOjE3NTAyODc2NTQsImFpZCI6IlphZ2dJUElBU0lxOEc1S0pUVDJJMUEifQ.kcadYHpUWi1W_GP3yiuNyRBfWyeeSakWHWUxCQ_MGjUEsIuhdK2EqLDNTwRJLXWkbRf3BoHLgUIgZqQDCUtEBA';

async function processAudioController(req, res) {
  try {
    const { title: reqTitle, date: reqDate, sendToTelegram: sendToTelegramFlag } = req.body;
    if (!req.file || !reqTitle || !reqDate) {
      return res.status(400).json({ error: 'Missing file, title, or date' });
    }

    const tempInputPath = `${ROUTE.SYSTEM.UPLOADS}/input_${Date.now()}.m4a`;
    const response = await fetch(zoomDownload);
    const nodeStream = Readable.fromWeb(response.body);

    await pipeline(
      nodeStream,
      fs.createWriteStream(tempInputPath)
    );

    const fileStats = fs.statSync(tempInputPath);

    const {
      inputPath,
      title,
      fileName,
      outputPath
    } = getFileData({ ...fileStats, path: tempInputPath }, reqTitle, reqDate);

    if(sendToTelegramFlag === 'true') res.status(200).json({
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

        if(sendToTelegramFlag === 'false') {
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
  processAudioController
}