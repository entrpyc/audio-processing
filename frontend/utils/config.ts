export const ZOOM_TOKEN_ENDPOINT = 'https://audio-processing.indepthwebsolutions.com/api/zoom-token';
export const ZOOM_RECORDINGS_ENDPOINT = 'https://audio-processing.indepthwebsolutions.com/api/recordings';

export type TelegramGroupType = { id: string, label: string };

export const TELEGRAM_SHEAF_YARD_2_GROUP = { id: '-1002885070590', label: 'Sheaf Yard 2' };
export const TELEGRAM_OIL_OF_GLADNESS = { id: '-1002286427385', label: 'Oil of Gladness' };
export const TELEGRAM_SHEAF_YARD_GROUP = { id: '-1001388987517', label: 'Sheaf Yard' };
export const TELEGRAM_RECORDINGS_GROUP = { id: '-1002853673929', label: 'Audio Recordings' };

export const TELEGRAM_GROUPS = [
  TELEGRAM_SHEAF_YARD_2_GROUP,
  TELEGRAM_OIL_OF_GLADNESS,
  TELEGRAM_SHEAF_YARD_GROUP,
  TELEGRAM_RECORDINGS_GROUP,
]

export enum SUBMISSION_STATES {
  INIT = 'init',
  STARTED = 'started',
  COMPLETED = 'completed',
}

export const BITRATE_OPTIONS = [
  { value: 0, label: '24k', formValue: '24' },
  { value: 12.5, label: '32k', formValue: '32' },
  { value: 25, label: '48k', formValue: '48' },
  { value: 37.5, label: '64k', formValue: '64' },
  { value: 50, label: '80k', formValue: '80' },
  { value: 62.5, label: '96k', formValue: '96' },
  { value: 75, label: '112k', formValue: '112' },
  { value: 87.5, label: '128k', formValue: '128' },
  { value: 100, label: '196k', formValue: '196' },
];

export const FREQUENCY_OPTIONS = [
  { value: 0, label: '11025' },
  { value: 25, label: '16000' },
  { value: 50, label: '22050' },
  { value: 75, label: '32000' },
  { value: 100, label: '44100' },
];

export enum SOURCE_TYPES {
  ZOOM_CLOUD = 'zoom-cloud',
  UPLOAD = 'upload',
}

export enum OUTPUT_TYPES {
  TELEGRAM = 'telegram',
  DOWNLOAD = 'download',
}

export enum AUDIO_FILTERS_TYPES {
  DEFAULT = 'default',
  NO_FILTERS = 'no-filters',
  CUSTOM = 'custom',
}

export const defaultVolumeBoost = 1.5;
export const defaultBitrate = 37.5;
export const defaultFrequency = 100;
