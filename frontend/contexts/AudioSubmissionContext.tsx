'use client'

import { createContext, Dispatch, SetStateAction, useState } from "react";
import { ZoomRecording } from "../types/types";
import { TELEGRAM_SHEAF_YARD_2_GROUP, TelegramGroupType } from "../utils/config";

type AudioSubmissionContextValue = {
  selectedRecording: ZoomRecording | undefined;
  setSelectedRecording: Dispatch<SetStateAction<ZoomRecording | undefined>>;
  selectedGroup: TelegramGroupType;
  setSelectedGroup: Dispatch<SetStateAction<TelegramGroupType>>;
}

const defaultValues = {
  selectedRecording: undefined,
  setSelectedRecording: () => {},
  selectedGroup: TELEGRAM_SHEAF_YARD_2_GROUP,
  setSelectedGroup: () => {},
}

export const AudioSubmissionContext = createContext<AudioSubmissionContextValue>(defaultValues);

export function AudioSubmissionProvider({ children }: { children: React.ReactNode }) {
  const [selectedRecording, setSelectedRecording] = useState<ZoomRecording | undefined>(defaultValues.selectedRecording);
  const [selectedGroup, setSelectedGroup] = useState<TelegramGroupType>(defaultValues.selectedGroup);

  return (
    <AudioSubmissionContext.Provider value={{
      selectedRecording,
      setSelectedRecording,
      selectedGroup,
      setSelectedGroup
    }}>
      {children}
    </AudioSubmissionContext.Provider>
  );
}