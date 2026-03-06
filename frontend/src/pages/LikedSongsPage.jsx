// LikedSongsPage.jsx
import { useState, useEffect } from 'react';
import { authAPI } from '../utils/api';
import SongCard from '../components/player/SongCard';
import { HiPlay, HiHeart } from 'react-icons/hi';
import { usePlayer } from '../context/PlayerContext';

const LikedSongsPage = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playSong } = usePlayer();

  useEffect(() => {
    authAPI.getMe().then(r => { setSongs(r.data.likedSongs || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#1DB954] border-t-transparent rounded-full animate-spin"/></div>;

  return (
    <div className="fade-in">
      <div className="flex items-end gap-6 mb-6 bg-gradient-to-b from-[#4a148c] to-transparent p-6 rounded-lg">
        <div className="w-48 h-48 rounded-lg shadow-2xl bg-gradient-to-br from-indigo-900 to-blue-400 flex items-center justify-center shrink-0">
          <HiHeart className="text-white" size={80} />
        </div>
        <div>
          <p className="text-white text-xs font-bold uppercase mb-1">Playlist</p>
          <h1 className="text-white font-bold text-4xl mb-2">Liked Songs</h1>
          <p className="text-[#B3B3B3] text-sm">{songs.length} songs</p>
        </div>
      </div>

      {songs.length > 0 && (
        <button
          onClick={() => playSong(songs[0], songs)}
          className="w-14 h-14 bg-[#1DB954] rounded-full flex items-center justify-center mb-6 hover:scale-105 transition-transform shadow-lg"
        >
          <HiPlay className="text-black ml-1" size={28} />
        </button>
      )}

      <div className="space-y-1">
        {songs.length === 0 && <p className="text-[#B3B3B3] py-4">Songs you like will appear here. Start liking!</p>}
        {songs.map(song => <SongCard key={song._id} song={song} songList={songs} showAlbum />)}
      </div>
    </div>
  );
};

export default LikedSongsPage;
