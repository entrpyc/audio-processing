import { useContext } from "react"
import { AudioSubmissionContext } from "../contexts/AudioSubmissionContext";
import { ZoomRecording } from "../types/types";
import { TELEGRAM_GROUPS, TelegramGroupType } from "../utils/config";

export const useHandleAudioSubmission = () => {
  const { setSelectedRecording, setSelectedGroup } = useContext(AudioSubmissionContext);

  const handleSelectRecording = (recording: ZoomRecording) => {
    setSelectedRecording(recording);
  }

  const handleSelectGroup = (groupId: string | null) => {
    const selectedGroup = TELEGRAM_GROUPS.find(g => g.id === groupId);
    if(selectedGroup) setSelectedGroup(selectedGroup);
  }

  return {
    handleSelectRecording,
    handleSelectGroup,
  }
}