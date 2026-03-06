import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { albumsAPI } from '../utils/api';
import SongCard from '../components/player/SongCard';
import { HiPlay } from 'react-icons/hi';
import { usePlayer } from '../context/PlayerContext';

const AlbumPage = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const { playSong } = usePlayer();

  useEffect(() => {
    albumsAPI.getOne(id).then(r => { setAlbum(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#1DB954] border-t-transparent rounded-full animate-spin"/></div>;
  if (!album) return <div className="text-white text-center py-20">Album not found</div>;

  const totalDuration = album.songs?.reduce((a, s) => a + (s.duration || 0), 0);
  const fmtDuration = (s) => s > 3600 ? `${Math.floor(s/3600)} hr ${Math.floor((s%3600)/60)} min` : `${Math.floor(s/60)} min`;

  return (
    <div className="fade-in">
      {/* Hero */}
      <div className="flex items-end gap-6 mb-6 bg-gradient-to-b from-[#404040] to-transparent p-6 rounded-lg">
        <div className="w-48 h-48 rounded-lg shadow-2xl overflow-hidden shrink-0 bg-[#282828]">
          {album.coverImage
            ? <img src={album.coverImage} alt={album.title} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-6xl">💿</div>
          }
        </div>
        <div>
          <p className="text-white text-xs font-bold uppercase mb-1">Album</p>
          <h1 className="text-white font-bold text-4xl mb-2">{album.title}</h1>
          <p className="text-[#B3B3B3] text-sm">
            {album.artist} · {album.year} · {album.songs?.length || 0} songs
            {totalDuration > 0 && `, ${fmtDuration(totalDuration)}`}
          </p>
        </div>
      </div>

      {/* Play button */}
      {album.songs?.length > 0 && (
        <button
          onClick={() => playSong(album.songs[0], album.songs)}
          className="w-14 h-14 bg-[#1DB954] rounded-full flex items-center justify-center mb-6 hover:scale-105 transition-transform shadow-lg"
        >
          <HiPlay className="text-black ml-1" size={28} />
        </button>
      )}

      {/* Song list */}
      <div className="space-y-1">
        {album.songs?.length === 0 && <p className="text-[#B3B3B3]">No songs in this album yet</p>}
        {album.songs?.map(song => (
          <SongCard key={song._id} song={song} songList={album.songs} />
        ))}
      </div>
    </div>
  );
};

export default AlbumPage;
