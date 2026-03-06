// LibraryPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { playlistsAPI, albumsAPI } from '../utils/api';
import { HiPlay } from 'react-icons/hi';
import { usePlayer } from '../context/PlayerContext';

const LibraryPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [tab, setTab] = useState('playlists');
  const { playSong } = usePlayer();

  useEffect(() => {
    playlistsAPI.getMy().then(r => setPlaylists(r.data)).catch(() => {});
    albumsAPI.getAll().then(r => setAlbums(r.data)).catch(() => {});
  }, []);

  return (
    <div className="fade-in">
      <h1 className="text-white text-3xl font-bold mb-6">Your Library</h1>
      <div className="flex gap-2 mb-6">
        {['playlists', 'albums'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition ${tab === t ? 'bg-white text-black' : 'bg-[#282828] text-white hover:bg-[#383838]'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'playlists' && (
        <div className="space-y-2">
          {playlists.length === 0 && <p className="text-[#B3B3B3]">No playlists yet. Create one from the sidebar!</p>}
          {playlists.map(pl => (
            <Link key={pl._id} to={`/playlist/${pl._id}`}
              className="flex items-center gap-4 p-3 rounded-md hover:bg-[#282828] transition-colors group">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded flex items-center justify-center text-xl shrink-0">🎵</div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">{pl.name}</p>
                <p className="text-[#B3B3B3] text-xs">{pl.songs?.length || 0} songs</p>
              </div>
              {pl.songs?.length > 0 && (
                <button onClick={(e) => { e.preventDefault(); playSong(pl.songs[0], pl.songs); }}
                  className="w-10 h-10 bg-[#1DB954] rounded-full hidden group-hover:flex items-center justify-center shadow-lg shrink-0">
                  <HiPlay className="text-black ml-0.5" size={16} />
                </button>
              )}
            </Link>
          ))}
        </div>
      )}

      {tab === 'albums' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {albums.length === 0 && <p className="text-[#B3B3B3] col-span-full">No albums available yet.</p>}
          {albums.map(album => (
            <Link key={album._id} to={`/album/${album._id}`}
              className="bg-[#181818] hover:bg-[#282828] rounded-lg p-4 transition-colors group">
              <div className="aspect-square rounded overflow-hidden bg-[#282828] mb-3">
                {album.coverImage
                  ? <img src={album.coverImage} alt={album.title} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-4xl">💿</div>
                }
              </div>
              <p className="text-white font-bold text-sm truncate">{album.title}</p>
              <p className="text-[#B3B3B3] text-xs truncate">{album.artist}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
