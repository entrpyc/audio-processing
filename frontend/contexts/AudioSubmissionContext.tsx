'use client'

import { createContext, Dispatch, RefObject, SetStateAction, useContext, useRef, useState } from "react";
import { ZoomRecording } from "../types/types";
import {
  AUDIO_FILTERS_TYPES,
  defaultBitrate,
  defaultFrequency,
  defaultVolumeBoost,
  OUTPUT_TYPES,
  SOURCE_TYPES,
  SUBMISSION_STATES,
  TELEGRAM_SHEAF_YARD_2_GROUP,
  TelegramGroupType,
} from "../utils/config";
import { useForm, UseFormReturnType } from "@mantine/form";

type FormRefsTypes = {
  audioFileRef: RefObject<HTMLInputElement | null>;
  titleRef: RefObject<HTMLInputElement | null>;
  dateRef: RefObject<HTMLInputElement | null>;
}

type FormType = UseFormReturnType<{
  audioFile: File | null;
  title: string;
  date: string;
}, (values: {
  audioFile: File | null;
  title: string;
  date: string;
}) => {
  audioFile: File | null;
  title: string;
  date: string;
}>

type AudioSubmissionContextValue = {
  selectedRecording: ZoomRecording | undefined;
  setSelectedRecording: Dispatch<SetStateAction<ZoomRecording | undefined>>;
  selectedGroup: TelegramGroupType;
  setSelectedGroup: Dispatch<SetStateAction<TelegramGroupType>>;
  status: string;
  setStatus: Dispatch<SetStateAction<string>>;
  source: SOURCE_TYPES;
  setSource: Dispatch<SetStateAction<SOURCE_TYPES>>;
  output: OUTPUT_TYPES;
  setOutput: Dispatch<SetStateAction<OUTPUT_TYPES>>;
  filters: AUDIO_FILTERS_TYPES;
  setFilters: Dispatch<SetStateAction<AUDIO_FILTERS_TYPES>>;
  volumeBoost: number;
  setVolumeBoost: Dispatch<SetStateAction<number>>;
  bitrate: number;
  setBitrate: Dispatch<SetStateAction<number>>;
  frequency: number;
  setFrequency: Dispatch<SetStateAction<number>>;
  submissionState: SUBMISSION_STATES;
  setSubmissionState: Dispatch<SetStateAction<SUBMISSION_STATES>>;
  submissionErrorState: boolean;
  setSubmissionErrorState: Dispatch<SetStateAction<boolean>>;
  activeStep: number;
  setActiveStep: Dispatch<SetStateAction<number>>;
  fieldRefs: FormRefsTypes;
  form: FormType;
}

export const AudioSubmissionContext = createContext<AudioSubmissionContextValue | undefined>(undefined);

export const useAudioSubmissionContext = (): AudioSubmissionContextValue => {
  const ctx = useContext(AudioSubmissionContext);

  if (!ctx) throw new Error('useAudioSubmissionContext must be used within <AudioSubmissionProvider>');

  return ctx;
}

export function AudioSubmissionProvider({ children }: { children: React.ReactNode }) {
  const [selectedRecording, setSelectedRecording] = useState<ZoomRecording | undefined>(undefined);
  const [selectedGroup, setSelectedGroup] = useState(TELEGRAM_SHEAF_YARD_2_GROUP);
  const [status, setStatus] = useState('');
  const [source, setSource] = useState(SOURCE_TYPES.ZOOM_CLOUD);
  const [output, setOutput] = useState(OUTPUT_TYPES.TELEGRAM);
  const [filters, setFilters] = useState(AUDIO_FILTERS_TYPES.DEFAULT);
  const [volumeBoost, setVolumeBoost] = useState(defaultVolumeBoost);
  const [bitrate, setBitrate] = useState(defaultBitrate);
  const [frequency, setFrequency] = useState(defaultFrequency);
  const [submissionState, setSubmissionState] = useState(SUBMISSION_STATES.INIT);
  const [submissionErrorState, setSubmissionErrorState] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const fieldRefs = {
    audioFileRef: useRef<HTMLInputElement>(null),
    titleRef: useRef<HTMLInputElement>(null),
    dateRef: useRef<HTMLInputElement>(null),
  };

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      audioFile: null as File | null,
      title: '',
      date: '',
    },
  });

  return (
    <AudioSubmissionContext.Provider value={{
      selectedRecording, setSelectedRecording,
      selectedGroup, setSelectedGroup,
      status, setStatus,
      source, setSource,
      output, setOutput,
      filters, setFilters,
      volumeBoost, setVolumeBoost,
      bitrate, setBitrate,
      frequency, setFrequency,
      submissionState, setSubmissionState,
      submissionErrorState, setSubmissionErrorState,
      activeStep, setActiveStep,
      fieldRefs,
      form
    }}>
      {children}
    </AudioSubmissionContext.Provider>
  );
}