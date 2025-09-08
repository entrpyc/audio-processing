import { useGetZoomData } from "./useGetZoomData"
import { useHandleZoomData } from "./useHandleZoomData"

export const useZoomData = () => {
  const zoomState = useGetZoomData();
  const zoomHandle = useHandleZoomData();
  
  return {
    ...zoomState,
    ...zoomHandle,
  }
}