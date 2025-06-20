const { createFileData } = require('../utils/formatting');
const { handleMissingRequestBody, validateRequiredParams } = require('../utils/errorHandling');
const { processAudioAndSendResult } = require('../services/audioService');
const { returnSendingToTelegramStatus } = require('../services/telegramService');

async function processAudioController(req, res) {
  if(!req?.body) return handleMissingRequestBody(req, res);

  const { title, date, sendToTelegram: sendToTelegramString, groupId, normalization, bitrate, applyFilters } = req.body;
  const sendToTelegram = JSON.parse(sendToTelegramString);
  
  const validParams = validateRequiredParams(res, { title, date, file: req.file, upload: sendToTelegram ? groupId : true })
  if(!validParams) return;


  const fileData = createFileData({ file: req.file, groupId, normalization, bitrate, title, date, applyFilters });

  if(sendToTelegram) returnSendingToTelegramStatus(res);

  processAudioAndSendResult({ fileData, sendToTelegram, res });
}

module.exports = {
  processAudioController
}