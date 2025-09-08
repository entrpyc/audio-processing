import { useContext } from "react"
import { AudioSubmissionContext } from "../contexts/AudioSubmissionContext";
import { ZoomRecording } from "../types/types";

export const useHandleAudioSubmission = () => {
  const { setSelectedRecording } = useContext(AudioSubmissionContext);

  const handleSelectRecording = (recording: ZoomRecording) => {
    setSelectedRecording(recording);
  }

  return {
    handleSelectRecording,
  }
}