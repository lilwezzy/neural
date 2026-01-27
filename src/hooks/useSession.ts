import { useState, useEffect, useCallback } from 'react';

export interface Session {
  id: string;
  programId: string;
  programName: string;
  category: string;
  duration: number;
  timestamp: string;
}

const STORAGE_KEY = 'neural-shift-sessions';

export function useSessionHistory() {
  const [sessions, setSessions] = useState<Session[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  const addSession = useCallback((programId: string, programName: string, category: string, duration: number) => {
    const newSession: Session = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      programId,
      programName,
      category,
      duration,
      timestamp: new Date().toISOString(),
    };
    setSessions((prev) => [newSession, ...prev]);
    return newSession;
  }, []);

  const clearSessions = useCallback(() => {
    setSessions([]);
  }, []);

  const getRecentSessions = useCallback((limit: number = 10) => {
    return sessions.slice(0, limit);
  }, [sessions]);

  const getTotalTime = useCallback(() => {
    return sessions.reduce((total, session) => total + session.duration, 0);
  }, [sessions]);

  const getSessionsByProgram = useCallback((programId: string) => {
    return sessions.filter((s) => s.programId === programId);
  }, [sessions]);

  return {
    sessions,
    addSession,
    clearSessions,
    getRecentSessions,
    getTotalTime,
    getSessionsByProgram,
  };
}

export function usePreferences() {
  const [masterVolume, setMasterVolume] = useState<number>(() => {
    const saved = localStorage.getItem('neural-shift-volume');
    return saved ? parseFloat(saved) : 0.5;
  });

  const [subliminalVolume, setSubliminalVolume] = useState<number>(() => {
    const saved = localStorage.getItem('neural-shift-subliminal');
    return saved ? parseFloat(saved) : 0.05;
  });

  const [lastProgram, setLastProgram] = useState<string | null>(() => {
    return localStorage.getItem('neural-shift-last-program');
  });

  useEffect(() => {
    localStorage.setItem('neural-shift-volume', masterVolume.toString());
  }, [masterVolume]);

  useEffect(() => {
    localStorage.setItem('neural-shift-subliminal', subliminalVolume.toString());
  }, [subliminalVolume]);

  useEffect(() => {
    if (lastProgram) {
      localStorage.setItem('neural-shift-last-program', lastProgram);
    }
  }, [lastProgram]);

  return {
    masterVolume,
    setMasterVolume,
    subliminalVolume,
    setSubliminalVolume,
    lastProgram,
    setLastProgram,
  };
}

export function useAnalytics() {
  const getSessionCount = useCallback(() => {
    const saved = localStorage.getItem('neural-shift-session-count');
    return saved ? parseInt(saved, 10) : 0;
  }, []);

  const getFirstVisit = useCallback(() => {
    return localStorage.getItem('neural-shift-first-visit');
  }, []);

  const getTotalProgramsUsed = useCallback(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return 0;
    const sessions = JSON.parse(saved) as Session[];
    const unique = new Set(sessions.map((s) => s.programId));
    return unique.size;
  }, []);

  return {
    getSessionCount,
    getFirstVisit,
    getTotalProgramsUsed,
  };
}
