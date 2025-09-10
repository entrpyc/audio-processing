'use client'

import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";
import { ZoomRecording } from "../types/types";

type ZoomDataContextValue = {
  recordings: ZoomRecording[];
  setRecordings: Dispatch<SetStateAction<ZoomRecording[]>>;
  zoomToken: string;
  setZoomToken: Dispatch<SetStateAction<string>>;
}

export const ZoomDataContext = createContext<ZoomDataContextValue | undefined>(undefined);

export const useZoomDataContext = (): ZoomDataContextValue => {
  const ctx = useContext(ZoomDataContext);

  if (!ctx) throw new Error('useZoomDataContext must be used within <ZoomDataProvider>');

  return ctx;
}

export function ZoomDataProvider({ children }: { children: React.ReactNode }) {
  const [recordings, setRecordings] = useState<ZoomRecording[]>([]);
  const [zoomToken, setZoomToken] = useState('');

  return (
    <ZoomDataContext.Provider value={{
      recordings,
      setRecordings,
      zoomToken,
      setZoomToken
    }}>
      {children}
    </ZoomDataContext.Provider>
  );
}