import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState('none'); // 'none' | 'one' | 'all'
  const audioRef = useRef(new Audio());

  // Update audio src when song changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!currentSong?.audioUrl) return;
    audio.src = currentSong.audioUrl;
    audio.volume = volume;
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  }, [currentSong]);

  // Volume
  useEffect(() => {
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // Event listeners
  useEffect(() => {
    const audio = audioRef.current;
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration);
    const onEnded = () => handleNext();
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, [queue, queueIndex, shuffle, repeat]);

  const playSong = useCallback((song, songList = []) => {
    if (songList.length > 0) {
      setQueue(songList);
      const idx = songList.findIndex((s) => s._id === song._id);
      setQueueIndex(idx >= 0 ? idx : 0);
    }
    setCurrentSong(song);
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!currentSong) return;
    isPlaying ? audio.pause() : audio.play();
  }, [isPlaying, currentSong]);

  const handleNext = useCallback(() => {
    if (repeat === 'one') {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      return;
    }
    if (queue.length === 0) return;
    let nextIdx;
    if (shuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else {
      nextIdx = (queueIndex + 1) % queue.length;
    }
    if (nextIdx === 0 && repeat === 'none' && !shuffle) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }
    setQueueIndex(nextIdx);
    setCurrentSong(queue[nextIdx]);
  }, [queue, queueIndex, shuffle, repeat]);

  const handlePrev = useCallback(() => {
    if (currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    if (queue.length === 0) return;
    const prevIdx = (queueIndex - 1 + queue.length) % queue.length;
    setQueueIndex(prevIdx);
    setCurrentSong(queue[prevIdx]);
  }, [queue, queueIndex, currentTime]);

  const seekTo = useCallback((time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  const addToQueue = useCallback((song) => {
    setQueue((prev) => [...prev, song]);
  }, []);

  return (
    <PlayerContext.Provider value={{
      currentSong, queue, isPlaying, duration, currentTime,
      volume, isMuted, shuffle, repeat,
      playSong, togglePlay, handleNext, handlePrev,
      seekTo, setVolume, setIsMuted, setShuffle,
      setRepeat: () => setRepeat((r) => r === 'none' ? 'all' : r === 'all' ? 'one' : 'none'),
      addToQueue,
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
