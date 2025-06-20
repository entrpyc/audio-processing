const { createFileData } = require('../utils/formatting');
const { readFile } = require('../utils/fileSystem.js');
const { downloadZoomRecording } = require('../services/zoomService.js');
const { validateRequiredParams, handleMissingRequestBody } = require('../utils/errorHandling.js');
const { returnSendingToTelegramStatus } = require('../services/telegramService.js');
const { processAudioAndSendResult } = require('../services/audioService.js');

async function processZoomRecordingController(req, res) {
  if(!req?.body) return handleMissingRequestBody(req, res);

  const { title, date, downloadUrl, sendToTelegram, groupId, normalization, bitrate, applyFilters } = req.body;
  const validParams = validateRequiredParams(res, { title, date, downloadUrl, upload: sendToTelegram ? groupId : true })
  if(!validParams) return;

  
  const filePath = await downloadZoomRecording({ downloadUrl });
  const file = readFile(filePath);
  const fileData = createFileData({ file: { ...file, path: filePath }, groupId, normalization, bitrate, title, date, applyFilters });
  
  if(sendToTelegram) returnSendingToTelegramStatus(res);

  processAudioAndSendResult({ fileData, sendToTelegram, res });
}

module.exports = {
  processZoomRecordingController
}