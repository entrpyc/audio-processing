import { useContext } from "react"
import { RecordingsContext } from "../contexts/RecordingsContext"

export const useHandleRecordings = () => {
  const { setRecordings } = useContext(RecordingsContext);

  return {
    setRecordings
  }
}