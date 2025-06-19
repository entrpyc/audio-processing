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
  PROCESS_ZOOM_RECORDING: '/process-zoom-recording',
  RECORDINGS: '/recordings',
  HEALTH: '/health',
}

const FILE_SIZE_LIMIT = 400;
const TELEGRAM_AUDIO_SIZE_LIMIT = 50;

const ZOOM_RECORDING_FILE_TYPE = 'M4A';

module.exports = {
  ROUTE,
  FILE_SIZE_LIMIT,
  TELEGRAM_AUDIO_SIZE_LIMIT,
  ZOOM_RECORDING_FILE_TYPE,
}