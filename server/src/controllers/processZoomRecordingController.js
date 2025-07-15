const { createFileData } = require('../utils/formatting');
const { readFile } = require('../utils/fileSystem.js');
const { downloadZoomRecording } = require('../services/zoomService.js');
const { validateRequiredParams, handleMissingRequestBody } = require('../utils/errorHandling.js');
const { returnSendingToTelegramStatus } = require('../services/telegramService.js');
const { processAudioAndSendResult } = require('../services/audioService.js');
const { log } = require('../utils/logger.js');

async function processZoomRecordingController(req, res) {
  if(!req?.body) return handleMissingRequestBody(req, res);
  log('processZoomRecordingController', req.body)

  const { title, date, downloadUrl, sendToTelegram, groupId, zoomToken } = req.body;
  const validParams = validateRequiredParams(res, { title, date, downloadUrl, upload: sendToTelegram ? groupId : true, zoomToken });
  if(!validParams) return;

  if(sendToTelegram) returnSendingToTelegramStatus(res);
  
  const filePath = await downloadZoomRecording(req.body);
  const file = readFile(filePath);
  const fileData = createFileData({ ...req.body, file: { ...file, path: filePath } });

  processAudioAndSendResult({ fileData, sendToTelegram, res });
}

module.exports = {
  processZoomRecordingController
}