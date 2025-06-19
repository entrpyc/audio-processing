const { createFileData } = require('../utils/formatting');
const { audioProcessor } = require('../services/audioProcessingService');
const { handleServerError, handleMissingRequestBody } = require('../utils/errorHandling');

async function processAudioController(req, res) {
  try {
    if(!req?.body) return handleMissingRequestBody(req, res);

    const { title, date, sendToTelegram } = req.body;
    const validParams = validateRequiredParams(res, { title, date, file: req.file })
    if(!validParams) return;

    const fileData = createFileData(req.file, title, date);

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
  processAudioController
}