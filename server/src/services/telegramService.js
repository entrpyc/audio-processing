const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const { ROUTE } = require('../config/constants');


async function sendAudioToTelegram(filePath, title) {
  const form = new FormData();
  form.append('chat_id', process.env.TELEGRAM_AUDIO_GROUP_ID);
  form.append('audio', fs.createReadStream(filePath));
  form.append('title', title);

  await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendAudio`,
    form,
    { headers: form.getHeaders() }
  );
}

async function sendDocumentToTelegram(filePath, fileName) {
  const downloadUrl = `${ROUTE.SERVER_URL}/${ROUTE.DOWNLOADS}/${encodeURIComponent(downloadPath)}`;
  await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    chat_id: process.env.TELEGRAM_DOCUMENTS_GROUP_ID,
    text: `🎧 *${title}*\n[Download Here](${downloadUrl})`,
    parse_mode: 'Markdown'
  });
}

module.exports = {
  sendAudioToTelegram,
  sendDocumentToTelegram
};