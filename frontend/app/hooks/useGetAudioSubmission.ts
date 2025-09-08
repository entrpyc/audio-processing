import { useContext } from "react"
import { AudioSubmissionContext } from "../contexts/AudioSubmissionContext";

export const useGetAudioSubmission = () => {
  const { selectedRecording } = useContext(AudioSubmissionContext);

  return {
    selectedRecording,
  }
}