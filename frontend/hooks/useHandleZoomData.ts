import { useZoomDataContext } from "../contexts/ZoomDataContext"
import { ZoomRecording } from "../types/types";
import { getStorage, setStorage, STORAGE_KEYS } from "../utils/storage";
import { fetchRecordings } from "../utils/zoomRecordings";
import { recordingsDateRange } from "../utils/helpers";
import { useGetZoomData } from "./useGetZoomData";
import { fetchToken } from "../utils/zoomToken";

export const useHandleZoomData = () => {
  const { zoomToken } = useGetZoomData();
  const { setRecordings, setZoomToken } = useZoomDataContext();

  const handleFetchZoomRecordings = async () => {
    if(!zoomToken) return;

    const storedRecordings = getStorage(STORAGE_KEYS.ZOOM_RECORDINGS) ?? [];

    if(storedRecordings.length) return setRecordings(storedRecordings);

    const recordingsRes = await fetchRecordings(zoomToken, recordingsDateRange);
    
    if(!recordingsRes) return;

    setRecordings(recordingsRes);
    setStorage(STORAGE_KEYS.ZOOM_RECORDINGS, recordingsRes)
  }

  const handleZoomToken = async () => {
    const tokenRes = await fetchToken();
    setZoomToken(tokenRes);
  }

  return {
    handleFetchZoomRecordings,
    handleZoomToken,
    setRecordings,
  }
}