
export enum STORAGE_KEYS {
  ZOOM_ACCESS_TOKEN = 'ZOOM_ACCESS_TOKEN',
  ZOOM_ACCESS_TOKEN_EXPIRY = 'ZOOM_ACCESS_TOKEN_EXPIRY',
  ZOOM_RECORDINGS = 'ZOOM_RECORDINGS',
  FETCHED_ALL_ZOOM_RECORDINGS = 'FETCHED_ALL_ZOOM_RECORDINGS',
}

export const getStorage = (key: STORAGE_KEYS, fallback?: any) => {
  const storageValue = localStorage.getItem(key);
  let parsedValue = null;

  try {
    parsedValue = JSON.parse(storageValue ?? fallback ?? 'null')
  } catch {
    parsedValue = storageValue;
  }

  return parsedValue;
}

export const setStorage = (key: STORAGE_KEYS, value: any) => {
  return localStorage.setItem(key, JSON.stringify(value));
}