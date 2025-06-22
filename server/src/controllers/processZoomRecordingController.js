const { createFileData } = require('../utils/formatting');
const { readFile } = require('../utils/fileSystem.js');
const { downloadZoomRecording } = require('../services/zoomService.js');
const { validateRequiredParams, handleMissingRequestBody } = require('../utils/errorHandling.js');
const { returnSendingToTelegramStatus } = require('../services/telegramService.js');
const { processAudioAndSendResult } = require('../services/audioService.js');

async function processZoomRecordingController(req, res) {
  if(!req?.body) return handleMissingRequestBody(req, res);
  console.log('processZoomRecordingController', req.body)

  const { title, date, downloadUrl, sendToTelegram, groupId, normalization, bitrate, applyFilters, zoomToken } = req.body;
  const validParams = validateRequiredParams(res, { title, date, downloadUrl, upload: sendToTelegram ? groupId : true, zoomToken })
  if(!validParams) return;

  if(sendToTelegram) returnSendingToTelegramStatus(res);
  
  const filePath = await downloadZoomRecording({ downloadUrl, zoomToken });
  const file = readFile(filePath);
  const fileData = createFileData({ file: { ...file, path: filePath }, groupId, normalization, bitrate, title, date, applyFilters });

  processAudioAndSendResult({ fileData, sendToTelegram, res });
}

module.exports = {
  processZoomRecordingController
}