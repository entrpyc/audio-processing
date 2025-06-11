function compressBitrate(fileSize) {
  if(fileSize < 100) return '128k';
  if(fileSize < 200) return '96k';
  if(fileSize < 300) return '64k';
  
  return '48k';
}

module.exports = {
  compressBitrate
}