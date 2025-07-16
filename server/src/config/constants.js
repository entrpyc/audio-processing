require('dotenv').config();

const ROUTE = {
  SERVER_URL: process.env.PUBLIC_SERVER_URL,
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
  ZOOM_TOKEN: '/zoom-token',
  HEALTH: '/health',
}

const FILE_SIZE_LIMIT = 400;
const TELEGRAM_AUDIO_SIZE_LIMIT = 50;

const ZOOM_RECORDING_FILE_TYPE = 'M4A';

const TELEGRAM_SEND_MESSAGE_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
const TELEGRAM_SEND_AUDIO_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendAudio`;

const ZOOM_RECORDINGS_URL = `https://api.zoom.us/v2/users/${process.env.ZOOM_USER_ID}/recordings`;
const ZOOM_AUTH_TOKEN_URL = 'https://zoom.us/oauth/token';

const DEFAULT_NORMALIZATION = 1.6;
const DEFAULT_FREQUENCY = 44100;
const DEFAULT_BITRATE = 64;
const DEFAULT_APPLY_FILTERS = 'true';

module.exports = {
  ROUTE,
  FILE_SIZE_LIMIT,
  TELEGRAM_AUDIO_SIZE_LIMIT,
  ZOOM_RECORDING_FILE_TYPE,
  TELEGRAM_SEND_MESSAGE_URL,
  TELEGRAM_SEND_AUDIO_URL,
  ZOOM_RECORDINGS_URL,
  ZOOM_AUTH_TOKEN_URL,
  DEFAULT_NORMALIZATION,
  DEFAULT_BITRATE,
  DEFAULT_APPLY_FILTERS,
  DEFAULT_FREQUENCY,
}