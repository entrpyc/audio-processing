const { ROUTE, DEFAULT_NORMALIZATION, DEFAULT_BITRATE, DEFAULT_APPLY_FILTERS, DEFAULT_FREQUENCY } = require("../config/constants");

function formatDate(inputDate) {
  const date = new Date(inputDate);
  const day = date.getDate();
  const daySuffix =
    day === 1 || day === 21 || day === 31
      ? 'st'
      : day === 2 || day === 22
      ? 'nd'
      : day === 3 || day === 23
      ? 'rd'
      : 'th';
  const options = { month: 'long' };
  const month = date.toLocaleDateString('en-GB', options);
  const year = date.getFullYear();
  return `${day}${daySuffix} ${month}, ${year}`;
}

const createFileData = ({
  file,
  title,
  date,
  groupId,
  frequency,
  normalization,
  bitrate,
  applyFilters,
}) => {
  const formattedDate = formatDate(date);
  const formattedName = title.toLowerCase().charAt(0).toUpperCase() + title.slice(1);
  const fullTitle = `${formattedName} - ${formattedDate}`;
  const fileName = `${fullTitle}.mp3`;

  return {
    inputPath: file.path,
    outputPath: `${ROUTE.SYSTEM.PROCESSED}/${fileName}`,
    fileSize: (file.size / (1024 * 1024)).toFixed(2),
    fileName,
    title: fullTitle,
    date: formattedDate,
    name: formattedName,
    groupId,
    normalization: Number(normalization ?? DEFAULT_NORMALIZATION),
    bitrate: Number(bitrate ?? DEFAULT_BITRATE),
    frequency: Number(frequency ?? DEFAULT_FREQUENCY),
    applyFilters: JSON.parse(applyFilters ?? DEFAULT_APPLY_FILTERS),
  }
}

const parseBitsToMB = (bits) => bits * 1024 * 1024;
const parseMBtoBits = (bits) => bits / (1024 * 1024);

module.exports = {
  createFileData,
  formatDate,
  parseBitsToMB,
  parseMBtoBits,
}