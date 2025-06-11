const ROUTE = {
  SYSTEM: {
    UPLOADS: 'system/uploads',
    PROCESSED: 'system/processed',
  },
  DOWNLOADS: 'public/downloads',
  SERVER_URL: 'http://wsl:5000',
}

const FILE_SIZE_LIMIT = 400;
const TELEGRAM_AUDIO_SIZE_LIMIT = 50;

module.exports = {
  ROUTE,
  FILE_SIZE_LIMIT,
  TELEGRAM_AUDIO_SIZE_LIMIT,
}