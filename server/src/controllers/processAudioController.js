const { createFileData } = require('../utils/formatting');
const { handleMissingRequestBody, validateRequiredParams } = require('../utils/errorHandling');
const { processAudioAndSendResult } = require('../services/audioService');
const { returnSendingToTelegramStatus } = require('../services/telegramService');
const { log } = require('../utils/logger');

async function processAudioController(req, res) {
  if(!req?.body) return handleMissingRequestBody(req, res);
  log('processAudioController', req.body)

  const { title, date, sendToTelegram: sendToTelegramString, groupId } = req.body;
  const sendToTelegram = JSON.parse(sendToTelegramString);
  
  const validParams = validateRequiredParams(res, { title, date, file: req.file, upload: sendToTelegram ? groupId : true })
  if(!validParams) return;

  const fileData = createFileData({ ...req.body, file: req.file });

  if(sendToTelegram) returnSendingToTelegramStatus(res);

  processAudioAndSendResult({ fileData, sendToTelegram, res });
}

module.exports = {
  processAudioController
}