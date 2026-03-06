import { useState, useEffect } from 'react';
import { songsAPI, albumsAPI } from '../utils/api';
import SongCard from '../components/player/SongCard';
import AlbumCard from '../components/player/AlbumCard';
import { usePlayer } from '../context/PlayerContext';
import { HiPlay } from 'react-icons/hi';

const greet = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

const HomePage = () => {
  const [trending, setTrending] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [recentSongs, setRecentSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playSong } = usePlayer();

  useEffect(() => {
    const fetch = async () => {
      try {
        const [trendRes, albumRes, songsRes] = await Promise.all([
          songsAPI.getTrending(),
          albumsAPI.getAll(),
          songsAPI.getAll({ limit: 10 }),
        ]);
        setTrending(trendRes.data);
        setAlbums(albumRes.data.slice(0, 6));
        setRecentSongs(songsRes.data.songs);
      } catch { } finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#1DB954] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="fade-in space-y-8">
      {/* Greeting */}
      <h1 className="text-white text-3xl font-bold">{greet()}</h1>

      {/* Quick picks */}
      {recentSongs.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {recentSongs.slice(0, 6).map((song) => (
            <button
              key={song._id}
              onClick={() => playSong(song, recentSongs)}
              className="flex items-center gap-4 bg-[#ffffff1a] hover:bg-[#ffffff33] rounded-md overflow-hidden transition-colors group"
            >
              <div className="w-16 h-16 shrink-0 bg-[#282828] overflow-hidden">
                {song.coverImage
                  ? <img src={song.coverImage} alt={song.title} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-2xl">🎵</div>
                }
              </div>
              <span className="text-white text-sm font-bold flex-1 text-left pr-2 truncate">{song.title}</span>
              <div className="w-10 h-10 bg-[#1DB954] rounded-full hidden group-hover:flex items-center justify-center mr-2 shrink-0 shadow-lg">
                <HiPlay className="text-black ml-0.5" size={16} />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Trending */}
      {trending.length > 0 && (
        <section>
          <h2 className="text-white text-xl font-bold mb-4">Trending Right Now</h2>
          <div className="space-y-1">
            {trending.map((song) => (
              <SongCard key={song._id} song={song} songList={trending} showAlbum />
            ))}
          </div>
        </section>
      )}

      {/* Albums */}
      {albums.length > 0 && (
        <section>
          <h2 className="text-white text-xl font-bold mb-4">Albums</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {albums.map((album) => (
              <AlbumCard key={album._id} album={album} />
            ))}
          </div>
        </section>
      )}

      {recentSongs.length === 0 && albums.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🎵</div>
          <h2 className="text-white text-2xl font-bold mb-2">No music yet</h2>
          <p className="text-[#B3B3B3]">Ask an admin to upload songs to get started!</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
