const { TELEGRAM_AUDIO_SIZE_LIMIT } = require("../config/constants");
const { log } = require("../utils/logger");
const { sendDocumentToTelegram, sendAudioToTelegram } = require("./telegramService");

const uploadToTelegram = async ({
  fileSize,
  outputPath,
  fileName,
  title,
  groupId
}) => {
  try {
    if(fileSize > TELEGRAM_AUDIO_SIZE_LIMIT) await sendDocumentToTelegram({ outputPath, fileName, groupId });
    else await sendAudioToTelegram({ outputPath, title, groupId });
  } catch (err) {
    console.error('Telegram upload failed:', err);
  }
}

const downloadFile = ({ outputPath, res }) => new Promise((resolve, reject) => {
  log('res', 'download')
  res.download(outputPath, (err) => {
    if (err) {
      console.error(err);
      log('res', 'Download failed')
      res.status(500).json({ error: 'Download failed' });
      return reject(err);
    }
    resolve();
  });
});

module.exports = {
  uploadToTelegram,
  downloadFile,
}