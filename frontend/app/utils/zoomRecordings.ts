import { ZoomRecording } from "../types/types";
import { ZOOM_RECORDINGS_ENDPOINT } from "./config";

export const fetchRecordings = async (zoomToken: string) => {
  const res = await fetch(ZOOM_RECORDINGS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ zoomToken }),
  });
  const data = await res.json();
  
  if(data.error) return;

  return data.recordings?.filter((rec: ZoomRecording) => Boolean(rec.downloadUrl)) || [];
}