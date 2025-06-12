const ROUTE = {
  SERVER_URL: process.env.SERVER_URL,
  SYSTEM: {
    UPLOADS: 'system/uploads',
    PROCESSED: 'system/processed',
  },
  PUBLIC: {
    INDEX: 'public',
    DOWNLOAD: 'download.html',
    DOWNLOADS: 'public/downloads',
  },
  PROCESS_AUDIO: '/process-audio',
}

const FILE_SIZE_LIMIT = 400;
const TELEGRAM_AUDIO_SIZE_LIMIT = 50;

module.exports = {
  ROUTE,
  FILE_SIZE_LIMIT,
  TELEGRAM_AUDIO_SIZE_LIMIT,
}