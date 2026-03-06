import { useState, useEffect } from 'react';
import { discoverAPI } from '../utils/api';
import { HiGlobe, HiSearch, HiMusicNote, HiUser } from 'react-icons/hi';

const DiscoverPage = () => {
  const [tab, setTab] = useState('trending');
  const [trending, setTrending] = useState([]);
  const [artists, setArtists] = useState([]);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tab === 'trending' && trending.length === 0) {
      setLoading(true);
      discoverAPI.getTrending().then(r => setTrending(r.data.songs || [])).catch(() => {}).finally(() => setLoading(false));
    }
    if (tab === 'artists' && artists.length === 0) {
      setLoading(true);
      discoverAPI.getArtists().then(r => setArtists(r.data.artists || [])).catch(() => {}).finally(() => setLoading(false));
    }
  }, [tab]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const { data } = await discoverAPI.search(query);
      setSearchResults(data.songs || []);
    } catch {} finally { setLoading(false); }
  };

  return (
    <div className="fade-in">
      <div className="flex items-center gap-3 mb-6">
        <HiGlobe className="text-[#1DB954]" size={32} />
        <h1 className="text-white text-3xl font-bold">Discover</h1>
      </div>
      <p className="text-[#B3B3B3] mb-6">Explore trending music from around the world via Last.fm</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['trending', 'artists', 'search'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition ${tab === t ? 'bg-white text-black' : 'bg-[#282828] text-white hover:bg-[#383838]'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Search tab */}
      {tab === 'search' && (
        <div>
          <form onSubmit={handleSearch} className="flex gap-3 mb-6">
            <input
              type="text" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search for songs on Last.fm..."
              className="flex-1 max-w-md bg-white text-black placeholder-gray-500 rounded-full py-2 px-5 text-sm outline-none"
            />
            <button type="submit" className="bg-[#1DB954] text-black font-bold px-6 py-2 rounded-full text-sm hover:bg-[#1ed760] transition">
              Search
            </button>
          </form>
          {loading && <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-[#1DB954] border-t-transparent rounded-full animate-spin"/></div>}
          <div className="space-y-2">
            {searchResults.map((song, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-md hover:bg-[#282828] transition">
                <div className="w-10 h-10 bg-[#282828] rounded overflow-hidden shrink-0">
                  {song.image ? <img src={song.image} alt={song.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><HiMusicNote className="text-[#B3B3B3]"/></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{song.title}</p>
                  <p className="text-[#B3B3B3] text-xs">{song.artist}</p>
                </div>
                <a href={song.url} target="_blank" rel="noreferrer" className="text-[#1DB954] text-xs hover:underline shrink-0">View ↗</a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trending tab */}
      {tab === 'trending' && (
        <div>
          {loading && <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-[#1DB954] border-t-transparent rounded-full animate-spin"/></div>}
          <div className="space-y-2">
            {trending.map((song, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-md hover:bg-[#282828] transition">
                <span className="text-[#B3B3B3] text-sm w-6 text-right shrink-0">{i + 1}</span>
                <div className="w-10 h-10 bg-[#282828] rounded overflow-hidden shrink-0">
                  {song.image ? <img src={song.image} alt={song.title} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center"><HiMusicNote className="text-[#B3B3B3]"/></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{song.title}</p>
                  <p className="text-[#B3B3B3] text-xs">{song.artist}</p>
                </div>
                <span className="text-[#B3B3B3] text-xs shrink-0">{Number(song.plays).toLocaleString()} plays</span>
                <a href={song.url} target="_blank" rel="noreferrer" className="text-[#1DB954] text-xs hover:underline shrink-0">Last.fm ↗</a>
              </div>
            ))}
          </div>
          {!loading && trending.length === 0 && <p className="text-[#B3B3B3]">Configure LASTFM_API_KEY in .env to see trending songs</p>}
        </div>
      )}

      {/* Artists tab */}
      {tab === 'artists' && (
        <div>
          {loading && <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-[#1DB954] border-t-transparent rounded-full animate-spin"/></div>}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {artists.map((artist, i) => (
              <a key={i} href={artist.url} target="_blank" rel="noreferrer"
                className="bg-[#181818] hover:bg-[#282828] rounded-lg p-4 text-center transition group">
                <div className="w-24 h-24 rounded-full bg-[#282828] overflow-hidden mx-auto mb-3">
                  {artist.image ? <img src={artist.image} alt={artist.name} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center"><HiUser size={40} className="text-[#B3B3B3]"/></div>}
                </div>
                <p className="text-white font-bold text-sm truncate">{artist.name}</p>
                <p className="text-[#B3B3B3] text-xs">{Number(artist.listeners).toLocaleString()} listeners</p>
              </a>
            ))}
          </div>
          {!loading && artists.length === 0 && <p className="text-[#B3B3B3]">Configure LASTFM_API_KEY in .env to see artists</p>}
        </div>
      )}
    </div>
  );
};

export default DiscoverPage;
