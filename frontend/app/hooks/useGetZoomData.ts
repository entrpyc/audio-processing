import { useContext } from "react"
import { ZoomDataContext } from "../contexts/ZoomDataContext";

export const useGetZoomData = () => {
  const { recordings, zoomToken } = useContext(ZoomDataContext);

  return {
    recordings,
    zoomToken,
  }
}