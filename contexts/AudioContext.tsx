import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
} from "react";

interface AudioContextData {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTrack: string;
  trackName: string;
  toggle: () => void;
  setVolume: (v: number) => void;
  setTrack: (url: string, name: string) => void;
}

const AudioCtx = createContext({} as AudioContextData);

export function useAudio() {
  return useContext(AudioCtx);
}

interface AudioProviderProps {
  children: ReactNode;
}

export function AudioProvider({ children }: AudioProviderProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolumeState] = useState(0.3);
  const [currentTrack, setCurrentTrack] = useState(
    "/music/Crazy Story x Aria Math.mp3",
  );
  const [trackName, setTrackName] = useState("Crazy Story x Aria Math.mp3");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const audio = new Audio(currentTrack);
    audio.loop = true;
    audio.volume = volume;
    audio.muted = isMuted;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [currentTrack]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = isMuted;

    if (!isMuted && !isPlaying) {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [isMuted, isPlaying]);

  const toggle = () => {
    if (!audioRef.current) return;

    if (isMuted) {
      setIsMuted(false);
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      setIsMuted(true);
    }
  };

  const setVolume = (v: number) => {
    setVolumeState(Math.max(0, Math.min(1, v)));
  };

  const setTrack = (url: string, name: string) => {
    setCurrentTrack(url);
    setTrackName(name);
  };

  return (
    <AudioCtx.Provider
      value={{
        isPlaying,
        isMuted,
        volume,
        currentTrack,
        trackName,
        toggle,
        setVolume,
        setTrack,
      }}
    >
      {children}
    </AudioCtx.Provider>
  );
}
