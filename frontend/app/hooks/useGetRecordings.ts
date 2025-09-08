import { useContext } from "react"
import { RecordingsContext } from "../contexts/RecordingsContext"

export const useGetRecordings = () => {
  const { recordings } = useContext(RecordingsContext);

  return {
    recordings
  }
}