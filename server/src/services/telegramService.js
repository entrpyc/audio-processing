const axios = require('axios');
const FormData = require('form-data');
const { ROUTE, TELEGRAM_SEND_MESSAGE_URL, TELEGRAM_SEND_AUDIO_URL } = require('../config/constants');
const { readAudio, copyFile } = require('../utils/fileSystem');
const { log } = require('../utils/logger');

async function sendAudioToTelegram({ outputPath, title, groupId }) {
  const form = new FormData();
  form.append('chat_id', groupId);
  form.append('audio', readAudio(outputPath));
  form.append('title', title);

  await axios.post(
    TELEGRAM_SEND_AUDIO_URL,
    form,
    { headers: form.getHeaders() }
  );
}

async function sendDocumentToTelegram({ outputPath, fileName, groupId}) {
  copyFile(outputPath, `${ROUTE.PUBLIC.DOWNLOADS}/${fileName}`);

  const downloadUrl = `${ROUTE.SERVER_URL}/${ROUTE.PUBLIC.DOWNLOAD}?file=${encodeURIComponent(fileName)}`;

  const message = `📎 Download: [${fileName}](${downloadUrl})`;

  await axios.post(
    TELEGRAM_SEND_MESSAGE_URL,
    {
      chat_id: groupId,
      text: message,
      parse_mode: 'Markdown'
    }
  );
}

const returnSendingToTelegramStatus = (res) => {
  log('res', 'Uploaded! The recording will be posted to Telegram once its processed')
  res.status(200).json({
    status: 'Uploaded! The recording will be posted to Telegram once its processed'
  });
}

module.exports = {
  sendAudioToTelegram,
  sendDocumentToTelegram,
  returnSendingToTelegramStatus
};