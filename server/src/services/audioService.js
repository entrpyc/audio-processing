const { uploadToTelegram, downloadFile } = require("./uploadService.js.js");
const { deleteFile, readFile } = require('../utils/fileSystem.js');
const { processAudio } = require("../utils/audioSystem.js");
const { compressBitrate } = require("../utils/audioProcessing.js");
const { getFilters } = require("../config/audio.js");
const { parseMBtoBits } = require("../utils/formatting.js");

const handleSendAudioResult = async ({
  fileData,
  res,
  sendToTelegram,
}) => {
  const {
    inputPath,
    title,
    fileName,
    outputPath,
    groupId,
  } = fileData;

  const file = readFile(outputPath);
  const fileSize = parseMBtoBits(file.size);

  if(!sendToTelegram) await downloadFile({ outputPath, res });
  else await uploadToTelegram({ fileSize, outputPath, fileName, title, groupId });

  deleteFile(inputPath);
  deleteFile(outputPath);
}

const processAudioAndSendResult = async ({ fileData, sendToTelegram, res }) => {
  const { inputPath, outputPath, fileSize, bitrate, normalization } = fileData;

  await processAudio({
    inputPath,
    outputPath,
    bitrate: bitrate || compressBitrate(fileSize),
    filters: getFilters({ normalization })
  });

  handleSendAudioResult({
    fileData,
    res,
    sendToTelegram,
  });
}

module.exports = {
  handleSendAudioResult,
  processAudioAndSendResult,
}