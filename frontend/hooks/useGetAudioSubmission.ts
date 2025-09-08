import { useContext } from "react"
import { AudioSubmissionContext } from "../contexts/AudioSubmissionContext";

export const useGetAudioSubmission = () => {
  const { selectedRecording, selectedGroup } = useContext(AudioSubmissionContext);

  return {
    selectedRecording,
    selectedGroup,
  }
}