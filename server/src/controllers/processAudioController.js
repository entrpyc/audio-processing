const { createFileData } = require('../utils/formatting');
const { handleMissingRequestBody, validateRequiredParams } = require('../utils/errorHandling');
const { processAudioAndSendResult } = require('../services/audioService');
const { returnSendingToTelegramStatus } = require('../services/telegramService');

async function processAudioController(req, res) {
  if(!req?.body) return handleMissingRequestBody(req, res);

  const { title, date, sendToTelegram: sendToTelegramString } = req.body;
  const validParams = validateRequiredParams(res, { title, date, file: req.file })
  if(!validParams) return;

  const sendToTelegram = JSON.parse(sendToTelegramString);

  const fileData = createFileData(req.file, title, date);

  if(sendToTelegram) returnSendingToTelegramStatus(res);

  processAudioAndSendResult({ fileData, sendToTelegram, res });
}

module.exports = {
  processAudioController
}