import { useZoomDataContext } from "../contexts/ZoomDataContext";

export const useGetZoomData = () => {
  const { recordings, zoomToken } = useZoomDataContext();

  return {
    recordings,
    zoomToken,
  }
}