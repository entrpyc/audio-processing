function compressBitrate(fileSize) {
  if(fileSize < 100) return '96k';
  
  return '64k';
}

module.exports = {
  compressBitrate
}