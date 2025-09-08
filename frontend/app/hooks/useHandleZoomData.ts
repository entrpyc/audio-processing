import { useContext } from "react"
import { ZoomDataContext } from "../contexts/ZoomDataContext"
import { ZoomRecording } from "../types/types";
import { getStorage, setStorage, STORAGE_KEYS } from "../utils/storage";
import { fetchRecordings } from "../utils/zoomRecordings";
import { currentMonthRange, previousMonthRange } from "../utils/helpers";
import { useGetZoomData } from "./useGetZoomData";
import { fetchToken } from "../utils/zoomToken";

export const useHandleZoomData = () => {
  const { zoomToken } = useGetZoomData();
  const { setRecordings, setZoomToken } = useContext(ZoomDataContext);

  const handleFetchZoomRecordings = async () => {
    if(!zoomToken) return;

    const storedRecordings = getStorage(STORAGE_KEYS.ZOOM_RECORDINGS) ?? [];

    if(storedRecordings.length) return setRecordings(storedRecordings);

    const recordingsRes = await fetchRecordings(zoomToken, currentMonthRange);
    
    if(!recordingsRes) return;

    setRecordings(recordingsRes);
    setStorage(STORAGE_KEYS.ZOOM_RECORDINGS, recordingsRes)
  }

  const handleZoomToken = async () => {
    const tokenRes = await fetchToken();
    setZoomToken(tokenRes);
  }

  const handleFetchOlderZoomRecordings = async () => {
    if(!zoomToken) return false;

    const recordingsRes = await fetchRecordings(zoomToken, previousMonthRange);

    if(!recordingsRes) return false;
    
    setRecordings((rec: ZoomRecording[]) => [...rec, ...recordingsRes]);

    return true;
  }

  return {
    handleFetchZoomRecordings,
    handleZoomToken,
    handleFetchOlderZoomRecordings,
    setRecordings,
  }
}