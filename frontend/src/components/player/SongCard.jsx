import { useState, useEffect, useRef } from 'react';
import { HiPlay, HiHeart, HiDownload, HiPlusCircle, HiCheck } from 'react-icons/hi';
import { usePlayer } from '../../context/PlayerContext';
import { songsAPI, playlistsAPI } from '../../utils/api';
import { toast } from 'react-toastify';

const formatDuration = (s) => {
  if (!s) return '--:--';
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
};

const SongCard = ({ song, songList = [], showAlbum = false, onDelete }) => {
  const { playSong, currentSong, isPlaying } = usePlayer();
  const [liked, setLiked] = useState(false);
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [addedTo, setAddedTo] = useState([]);
  const menuRef = useRef(null);
  const isActive = currentSong?._id === song._id;

  const handlePlay = () => playSong(song, songList.length > 0 ? songList : [song]);

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      const { data } = await songsAPI.toggleLike(song._id);
      setLiked(data.liked);
      toast.success(data.liked ? '❤️ Added to Liked Songs' : 'Removed from Liked Songs');
    } catch { toast.error('Failed'); }
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    try {
      const { data } = await songsAPI.download(song._id);
      const link = document.createElement('a');
      link.href = data.downloadUrl;
      link.download = data.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Download started! ⬇️');
    } catch { toast.error('Download unavailable'); }
  };

  const openPlaylistMenu = async (e) => {
    e.stopPropagation();
    try {
      const { data } = await playlistsAPI.getMy();
      setPlaylists(data);
      setShowPlaylistMenu(true);
    } catch { toast.error('Could not load playlists'); }
  };

  const addToPlaylist = async (e, playlistId) => {
    e.stopPropagation();
    try {
      await playlistsAPI.addSong(playlistId, song._id);
      setAddedTo(prev => [...prev, playlistId]);
      toast.success('Added to playlist! 🎵');
    } catch { toast.error('Already in playlist or failed'); }
  };

  // Close menu on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowPlaylistMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div
      className={`group flex items-center gap-4 px-4 py-2 rounded-md cursor-pointer transition-colors ${isActive ? 'bg-[#282828]' : 'hover:bg-[#282828]/60'}`}
      onClick={handlePlay}
    >
      {/* Cover + play btn */}
      <div className="relative w-10 h-10 shrink-0">
        <img
          src={song.coverImage || ''}
          alt={song.title}
          className="w-full h-full object-cover rounded bg-[#282828]"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div className={`absolute inset-0 flex items-center justify-center bg-black/50 rounded transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          {isActive && isPlaying
            ? <div className="flex gap-0.5 items-end h-4">
                {[3,5,4,6,3].map((h,i) => (
                  <div key={i} className="w-0.5 bg-[#1DB954] rounded-full animate-bounce" style={{ height: `${h*2}px`, animationDelay: `${i*0.1}s` }} />
                ))}
              </div>
            : <HiPlay className="text-white ml-0.5" size={16} />
          }
        </div>
      </div>

      {/* Title & artist */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold truncate ${isActive ? 'text-[#1DB954]' : 'text-white'}`}>{song.title}</p>
        <p className="text-[#B3B3B3] text-xs truncate">{song.artist}</p>
      </div>

      {/* Album name if needed */}
      {showAlbum && (
        <span className="text-[#B3B3B3] text-sm hidden md:block truncate max-w-[120px]">
          {song.albumName || '—'}
        </span>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={handleLike} className={`transition-colors ${liked ? 'text-[#1DB954]' : 'text-[#B3B3B3] hover:text-white'}`}>
          <HiHeart size={16} />
        </button>
        <button onClick={handleDownload} className="text-[#B3B3B3] hover:text-white transition-colors">
          <HiDownload size={16} />
        </button>

        {/* Add to playlist button */}
        <div className="relative" ref={menuRef}>
          <button onClick={openPlaylistMenu} className="text-[#B3B3B3] hover:text-white transition-colors" title="Add to playlist">
            <HiPlusCircle size={16} />
          </button>

          {/* Playlist dropdown */}
          {showPlaylistMenu && (
            <div className="absolute right-0 bottom-6 bg-[#282828] rounded-lg shadow-xl z-50 w-48 py-2 border border-[#383838]">
              <p className="text-[#B3B3B3] text-xs px-3 pb-2 font-semibold uppercase border-b border-[#383838] mb-1">Add to playlist</p>
              {playlists.length === 0 && (
                <p className="text-[#B3B3B3] text-xs px-3 py-2">No playlists yet</p>
              )}
              {playlists.map(pl => (
                <button
                  key={pl._id}
                  onClick={(e) => addToPlaylist(e, pl._id)}
                  className="w-full text-left px-3 py-2 text-sm text-white hover:bg-[#383838] transition flex items-center justify-between"
                >
                  <span className="truncate">{pl.name}</span>
                  {addedTo.includes(pl._id) && <HiCheck className="text-[#1DB954] shrink-0" size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(song._id); }}
            className="text-red-400 hover:text-red-300 transition-colors text-xs font-semibold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Duration */}
      <span className="text-[#B3B3B3] text-sm shrink-0 w-10 text-right">{formatDuration(song.duration)}</span>
    </div>
  );
};

export default SongCard;