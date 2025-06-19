const { createFileData } = require('../utils/formatting');
const { audioProcessor } = require('../services/audioProcessingService.js');
const { createFile } = require('../utils/fileSystem.js');
const { downloadZoomRecording } = require('../services/zoomService.js');
const { validateRequiredParams, handleMissingRequestBody, handleServerError } = require('../utils/errorHandling.js');
const { returnSendingToTelegramStatus } = require('../services/telegramService.js');

async function processZoomRecordingController(req, res) {
  try {
    if(!req?.body) return handleMissingRequestBody(req, res);

    const { title, date, downloadUrl, sendToTelegram } = req.body;
    const validParams = validateRequiredParams(res, { title, date, downloadUrl })
    if(!validParams) return;

    const filePath = await downloadZoomRecording({ downloadUrl });
    const file = createFile(filePath);
    const fileData = createFileData({ ...file, path: filePath }, title, date);

    if(sendToTelegram) returnSendingToTelegramStatus(res);

    audioProcessor({
      fileData,
      res,
      sendToTelegram,
    });

  } catch (error) {
    handleServerError({ res, error });
  }
}

module.exports = {
  processZoomRecordingController
}