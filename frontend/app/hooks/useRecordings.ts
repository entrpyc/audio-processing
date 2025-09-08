import { useGetRecordings } from "./useGetRecordings"
import { useHandleRecordings } from "./useHandleRecordings"

export const useRecordings = () => {
  const recordingsState = useGetRecordings()
  const recordingsHandle = useHandleRecordings()
  
  return {
    ...recordingsState,
    ...recordingsHandle,
  }
}