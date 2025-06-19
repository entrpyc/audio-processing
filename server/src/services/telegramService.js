const axios = require('axios');
const FormData = require('form-data');
const { ROUTE, TELEGRAM_SEND_MESSAGE_URL, TELEGRAM_SEND_AUDIO_URL, DEFAULT_GROUP_ID } = require('../config/constants');
const { readAudio, copyFile } = require('../utils/fileSystem');

async function sendAudioToTelegram(filePath, title, groupId) {
  const form = new FormData();
  form.append('chat_id', groupId || DEFAULT_GROUP_ID);
  form.append('audio', readAudio(filePath));
  form.append('title', title);

  await axios.post(
    TELEGRAM_SEND_AUDIO_URL,
    form,
    { headers: form.getHeaders() }
  );
}

async function sendDocumentToTelegram(filePath, fileName) {
  copyFile(filePath, `${ROUTE.PUBLIC.DOWNLOADS}/${fileName}`);

  const downloadUrl = `${ROUTE.SERVER_URL}/${ROUTE.PUBLIC.DOWNLOAD}?file=${encodeURIComponent(fileName)}`;

  const message = `📎 Download: [${fileName}](${downloadUrl})`;

  await axios.post(
    TELEGRAM_SEND_MESSAGE_URL,
    {
      chat_id: process.env.TELEGRAM_DOCUMENTS_GROUP_ID,
      text: message,
      parse_mode: 'Markdown'
    }
  );
}

const returnSendingToTelegramStatus = (res) => {
  res.status(200).json({
    status: 'Uploaded! The recording will be posted to Telegram once its ready'
  });
}

module.exports = {
  sendAudioToTelegram,
  sendDocumentToTelegram,
  returnSendingToTelegramStatus
};