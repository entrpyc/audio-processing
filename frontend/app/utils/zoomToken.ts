import { ZOOM_TOKEN_ENDPOINT } from "./config";
import { getStorage, setStorage, STORAGE_KEYS } from "./storage";

export const fetchToken = async () => {
  const storedToken = getStorage(STORAGE_KEYS.ZOOM_ACCESS_TOKEN);
  const storedTokenExpiry = getStorage(STORAGE_KEYS.ZOOM_ACCESS_TOKEN_EXPIRY, 0);
  
  if(storedToken && Date.now() < storedTokenExpiry - 60000) return storedToken;

  const res = await fetch(ZOOM_TOKEN_ENDPOINT);
  const data = await res.json();

  if (data.error) return;

  setStorage(STORAGE_KEYS.ZOOM_ACCESS_TOKEN, data.zoomToken);
  setStorage(STORAGE_KEYS.ZOOM_RECORDINGS, []);
  setStorage(STORAGE_KEYS.ZOOM_ACCESS_TOKEN_EXPIRY, Date.now() + 60000);
  setStorage(STORAGE_KEYS.FETCHED_ALL_ZOOM_RECORDINGS, false);

  return data.zoomToken;
};