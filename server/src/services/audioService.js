const { uploadToTelegram, downloadFile } = require("./uploadService.js.js");
const { deleteFile, readFile } = require('../utils/fileSystem.js');
const { processAudio } = require("../utils/audioSystem.js");
const { getFilters } = require("../config/audio.js");
const { parseMBtoBits } = require("../utils/formatting.js");
const { log } = require("../utils/logger.js");

const handleSendAudioResult = async ({
  fileData,
  res,
  sendToTelegram,
}) => {
  const {
    inputPath,
    outputPath,
  } = fileData;

  const file = readFile(outputPath);
  const fileSize = parseMBtoBits(file.size);

  if(!sendToTelegram) await downloadFile({ outputPath, res });
  else await uploadToTelegram({ ...fileData, outputPath, fileSize });

  deleteFile(inputPath);
  deleteFile(outputPath);
}

const processAudioAndSendResult = async ({ fileData, sendToTelegram, res }) => {
  const { inputPath, outputPath, bitrate, frequency, normalization, applyFilters } = fileData;

  log('processAudioAndSendResult', fileData)

  await processAudio({
    inputPath,
    outputPath,
    bitrate,
    frequency,
    filters: getFilters({ normalization }),
    applyFilters
  });

  await handleSendAudioResult({
    fileData,
    res,
    sendToTelegram,
  });
}

module.exports = {
  handleSendAudioResult,
  processAudioAndSendResult,
}