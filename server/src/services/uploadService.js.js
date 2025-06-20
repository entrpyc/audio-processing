const { TELEGRAM_AUDIO_SIZE_LIMIT } = require("../config/constants");
const { sendDocumentToTelegram, sendAudioToTelegram } = require("./telegramService");

const uploadToTelegram = async ({
  fileSize,
  outputPath,
  fileName,
  title,
  groupId
}) => {
  try {
    if(fileSize > TELEGRAM_AUDIO_SIZE_LIMIT) await sendDocumentToTelegram(outputPath, fileName);
    else await sendAudioToTelegram(outputPath, title, groupId);
  } catch (err) {
    console.error('Telegram upload failed:', err);
  }
}

const downloadFile = ({ outputPath, res }) => new Promise((resolve, reject) => {
  console.log('res', 'download')
  res.download(outputPath, (err) => {
    if (err) {
      console.error(err);
      console.log('res', 'Download failed')
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