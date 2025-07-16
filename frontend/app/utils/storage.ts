
export enum STORAGE_KEYS {
  ZOOM_ACCESS_TOKEN = 'ZOOM_ACCESS_TOKEN',
  ZOOM_ACCESS_TOKEN_EXPIRY = 'ZOOM_ACCESS_TOKEN_EXPIRY',
}

export const getStorage = (key: STORAGE_KEYS) => {
  return localStorage.getItem(key);
}

export const setStorage = (key: STORAGE_KEYS, value: string) => {
  return localStorage.setItem(key, value);
}