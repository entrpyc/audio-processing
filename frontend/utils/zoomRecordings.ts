import { ZoomRecording } from "../types/types";
import { ZOOM_RECORDINGS_ENDPOINT } from "./config";

export const fetchRecordings = async (zoomToken: string, range: string[]): Promise<ZoomRecording[] | undefined> => {
  const res = await fetch(ZOOM_RECORDINGS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ zoomToken, range }),
  });

  const data = await res.json();
  
  if(data.error) return undefined;

  return data.recordings;
}