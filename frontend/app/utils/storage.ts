
export enum STORAGE_KEYS {
  ZOOM_ACCESS_TOKEN = 'ZOOM_ACCESS_TOKEN',
  ZOOM_ACCESS_TOKEN_EXPIRY = 'ZOOM_ACCESS_TOKEN_EXPIRY',
  ZOOM_RECORDINGS = 'ZOOM_RECORDINGS',
  FETCHED_ALL_ZOOM_RECORDINGS = 'FETCHED_ALL_ZOOM_RECORDINGS',
}

export const getStorage = (key: STORAGE_KEYS) => {
  return localStorage.getItem(key);
}

export const setStorage = (key: STORAGE_KEYS, value: string) => {
  return localStorage.setItem(key, value);
}