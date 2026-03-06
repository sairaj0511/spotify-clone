import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { playlistsAPI } from '../utils/api';
import SongCard from '../components/player/SongCard';
import { HiPlay, HiTrash } from 'react-icons/hi';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const PlaylistPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const { playSong } = usePlayer();
  const { user } = useAuth();

  useEffect(() => {
    playlistsAPI.getOne(id).then(r => { setPlaylist(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  const removeSong = async (songId) => {
    try {
      const { data } = await playlistsAPI.removeSong(id, songId);
      setPlaylist(data);
      toast.success('Song removed from playlist');
    } catch { toast.error('Failed to remove song'); }
  };

  const deletePlaylist = async () => {
    if (!confirm(`Delete "${playlist.name}"?`)) return;
    try {
      await playlistsAPI.delete(id);
      toast.success('Playlist deleted!');
      navigate('/library');
    } catch { toast.error('Failed to delete playlist'); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#1DB954] border-t-transparent rounded-full animate-spin"/></div>;
  if (!playlist) return <div className="text-white text-center py-20">Playlist not found</div>;

  const isOwner = user?._id === playlist.owner?._id || user?._id === playlist.owner;

  return (
    <div className="fade-in">
      <div className="flex items-end gap-6 mb-6 bg-gradient-to-b from-[#1a237e] to-transparent p-6 rounded-lg">
        <div className="w-48 h-48 rounded-lg shadow-2xl bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center shrink-0">
          <span className="text-6xl">🎵</span>
        </div>
        <div>
          <p className="text-white text-xs font-bold uppercase mb-1">Playlist</p>
          <h1 className="text-white font-bold text-4xl mb-2">{playlist.name}</h1>
          {playlist.description && <p className="text-[#B3B3B3] text-sm mb-1">{playlist.description}</p>}
          <p className="text-[#B3B3B3] text-sm">{playlist.owner?.name} · {playlist.songs?.length || 0} songs</p>
        </div>
      </div>

      {playlist.songs?.length > 0 && (
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => playSong(playlist.songs[0], playlist.songs)}
            className="w-14 h-14 bg-[#1DB954] rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
          >
            <HiPlay className="text-black ml-1" size={28} />
          </button>
          {isOwner && (
            <button
              onClick={deletePlaylist}
              className="flex items-center gap-2 text-[#B3B3B3] hover:text-red-400 transition-colors text-sm font-semibold"
            >
              <HiTrash size={18} /> Delete Playlist
            </button>
          )}
        </div>
      )}

      {playlist.songs?.length === 0 && isOwner && (
        <button
          onClick={deletePlaylist}
          className="flex items-center gap-2 text-[#B3B3B3] hover:text-red-400 transition-colors text-sm font-semibold mb-6"
        >
          <HiTrash size={18} /> Delete Playlist
        </button>
      )}

      <div className="space-y-1">
        {playlist.songs?.length === 0 && (
          <p className="text-[#B3B3B3] py-4">This playlist is empty. Search for songs to add!</p>
        )}
        {playlist.songs?.map(song => (
          <SongCard
            key={song._id} song={song} songList={playlist.songs}
            onDelete={isOwner ? removeSong : null}
          />
        ))}
      </div>
    </div>
  );
};

export default PlaylistPage;