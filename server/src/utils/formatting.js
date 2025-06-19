const { ROUTE } = require("../config/constants");

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

const createFileData = (file, name, date) => {
  const formattedDate = formatDate(date);
  const formattedName = name.toLowerCase().charAt(0).toUpperCase() + name.slice(1);
  const title = `${formattedName} - ${formattedDate}`;
  const fileName = `${title}.mp3`;

  return {
    inputPath: file.path,
    outputPath: `${ROUTE.SYSTEM.PROCESSED}/${fileName}`,
    fileSize: (file.size / (1024 * 1024)).toFixed(2),
    fileName,
    title,
    date: formattedDate,
    name: formattedName,
  }
}

module.exports = {
  createFileData,
  formatDate,
}