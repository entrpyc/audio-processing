export const ZOOM_TOKEN_ENDPOINT = 'https://audio-processing.indepthwebsolutions.com/api/zoom-token';
export const ZOOM_RECORDINGS_ENDPOINT = 'https://audio-processing.indepthwebsolutions.com/api/recordings';

export const TELEGRAM_OIL_OF_GLADNESS_ID = '-1002286427385';
export const TELEGRAM_SHEAF_YARD_GROUP_ID = '-1001388987517';
export const TELEGRAM_RECORDINGS_GROUP_ID = '-1002853673929';

export const TELEGRAM_GROUPS = [
  { value: TELEGRAM_SHEAF_YARD_GROUP_ID, label: 'Sheaf Yard' },
  { value: TELEGRAM_OIL_OF_GLADNESS_ID, label: 'Oil of Gladness' },
  { value: TELEGRAM_RECORDINGS_GROUP_ID, label: 'Audio Recordings' },
]

export const APP_STATES = {
  INIT: 'init',
  STARTED: 'started',
  COMPLETED: 'completed',
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