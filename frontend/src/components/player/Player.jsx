import { usePlayer } from '../../context/PlayerContext';
import { useAuth } from '../../context/AuthContext';
import { songsAPI } from '../../utils/api';
import { useState } from 'react';
import {
  HiPlay, HiPause, HiRewind, HiFastForward,
  HiVolumeUp, HiVolumeOff, HiHeart, HiDownload,
  HiRefresh, HiSwitchHorizontal
} from 'react-icons/hi';
import { toast } from 'react-toastify';

const formatTime = (s) => {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

const Player = () => {
  const {
    currentSong, isPlaying, duration, currentTime,
    volume, isMuted, shuffle, repeat,
    togglePlay, handleNext, handlePrev,
    seekTo, setVolume, setIsMuted, setShuffle, setRepeat,
  } = usePlayer();
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);

  const progress = duration ? (currentTime / duration) * 100 : 0;

  const handleSeek = (e) => seekTo((e.target.value / 100) * duration);
  const handleVolume = (e) => { setVolume(parseFloat(e.target.value)); setIsMuted(false); };

  const handleLike = async () => {
    if (!currentSong) return;
    try {
      const { data } = await songsAPI.toggleLike(currentSong._id);
      setLiked(data.liked);
      toast.success(data.liked ? '❤️ Added to Liked Songs' : 'Removed from Liked Songs');
    } catch { toast.error('Failed to like song'); }
  };

  const handleDownload = async () => {
    if (!currentSong) return;
    try {
      const { data } = await songsAPI.download(currentSong._id);
      const link = document.createElement('a');
      link.href = data.downloadUrl;
      link.download = data.filename;
      link.click();
      toast.success('Download started! ⬇️');
    } catch { toast.error('Download not available'); }
  };

  const repeatColor = repeat !== 'none' ? '#1DB954' : '#B3B3B3';
  const shuffleColor = shuffle ? '#1DB954' : '#B3B3B3';

  if (!currentSong) {
    return (
      <div className="h-20 bg-[#181818] border-t border-[#282828] flex items-center justify-center">
        <p className="text-[#B3B3B3] text-sm">No song playing — pick a track to start listening 🎵</p>
      </div>
    );
  }

  return (
    <div className="h-20 bg-[#181818] border-t border-[#282828] grid grid-cols-3 items-center px-4 gap-4 shrink-0">
      {/* Left: Song info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-14 h-14 rounded overflow-hidden bg-[#282828] shrink-0">
          {currentSong.coverImage ? (
            <img src={currentSong.coverImage} alt={currentSong.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">🎵</div>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-white text-sm font-semibold truncate">{currentSong.title}</p>
          <p className="text-[#B3B3B3] text-xs truncate">{currentSong.artist}</p>
        </div>
        <button onClick={handleLike} className={`ml-1 shrink-0 transition-colors ${liked ? 'text-[#1DB954]' : 'text-[#B3B3B3] hover:text-white'}`}>
          <HiHeart size={18} />
        </button>
        <button onClick={handleDownload} className="text-[#B3B3B3] hover:text-white transition-colors shrink-0">
          <HiDownload size={18} />
        </button>
      </div>

      {/* Center: Player controls + progress */}
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-4">
          <button onClick={() => setShuffle((s) => !s)} style={{ color: shuffleColor }} className="hover:brightness-125 transition">
            <HiSwitchHorizontal size={18} />
          </button>
          <button onClick={handlePrev} className="text-[#B3B3B3] hover:text-white transition-colors">
            <HiRewind size={22} />
          </button>
          <button
            onClick={togglePlay}
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying
              ? <HiPause className="text-black" size={20} />
              : <HiPlay className="text-black ml-0.5" size={20} />
            }
          </button>
          <button onClick={handleNext} className="text-[#B3B3B3] hover:text-white transition-colors">
            <HiFastForward size={22} />
          </button>
          <button onClick={setRepeat} style={{ color: repeatColor }} className="hover:brightness-125 transition relative">
            <HiRefresh size={18} />
            {repeat === 'one' && (
              <span className="absolute -top-1 -right-1 text-[8px] font-bold text-[#1DB954]">1</span>
            )}
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 w-full">
          <span className="text-[#B3B3B3] text-xs w-8 text-right">{formatTime(currentTime)}</span>
          <div className="relative flex-1 group">
            <input
              type="range" min={0} max={100}
              value={progress}
              onChange={handleSeek}
              className="w-full h-1 accent-white group-hover:accent-[#1DB954]"
            />
          </div>
          <span className="text-[#B3B3B3] text-xs w-8">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right: Volume */}
      <div className="flex items-center justify-end gap-2">
        <button onClick={() => setIsMuted((m) => !m)} className="text-[#B3B3B3] hover:text-white transition-colors">
          {isMuted || volume === 0 ? <HiVolumeOff size={20} /> : <HiVolumeUp size={20} />}
        </button>
        <input
          type="range" min={0} max={1} step={0.01}
          value={isMuted ? 0 : volume}
          onChange={handleVolume}
          className="w-24 h-1 accent-white hover:accent-[#1DB954]"
        />
      </div>
    </div>
  );
};

export default Player;
