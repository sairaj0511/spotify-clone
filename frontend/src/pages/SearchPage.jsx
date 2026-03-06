import { useState, useEffect, useRef } from 'react';
import { songsAPI } from '../utils/api';
import SongCard from '../components/player/SongCard';
import { HiSearch } from 'react-icons/hi';

const GENRES = ['Pop', 'Rock', 'Hip-Hop', 'R&B', 'Electronic', 'Jazz', 'Classical', 'Country', 'Latin', 'Indie'];
const COLORS = ['#E91429','#477D95','#E8115B','#148A08','#8D67AB','#D84000','#509BF5','#1E3264','#F59B23','#27856A'];

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounce = useRef(null);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await songsAPI.getAll({ search: query, limit: 30 });
        setResults(data.songs);
      } catch { } finally { setLoading(false); }
    }, 400);
    return () => clearTimeout(debounce.current);
  }, [query]);

  const searchByGenre = async (genre) => {
    setQuery(genre);
    setLoading(true);
    try {
      const { data } = await songsAPI.getAll({ genre, limit: 30 });
      setResults(data.songs);
    } catch { } finally { setLoading(false); }
  };

  return (
    <div className="fade-in">
      <h1 className="text-white text-3xl font-bold mb-6">Search</h1>

      {/* Search input */}
      <div className="relative mb-8">
        <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B3B3B3]" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What do you want to listen to?"
          className="w-full max-w-lg bg-white text-black placeholder-gray-500 rounded-full py-3 pl-12 pr-6 text-sm font-medium outline-none focus:ring-2 focus:ring-[#1DB954]"
          autoFocus
        />
      </div>

      {/* Genre cards */}
      {!query && (
        <div>
          <h2 className="text-white text-xl font-bold mb-4">Browse by Genre</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {GENRES.map((genre, i) => (
              <button
                key={genre}
                onClick={() => searchByGenre(genre)}
                className="relative h-24 rounded-lg overflow-hidden text-white font-bold text-lg text-left p-4 hover:scale-105 transition-transform"
                style={{ backgroundColor: COLORS[i] }}
              >
                {genre}
                <span className="absolute bottom-2 right-2 text-3xl opacity-60">🎵</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-[#1DB954] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && query && results.length > 0 && (
        <div>
          <h2 className="text-white text-xl font-bold mb-4">Results for "{query}"</h2>
          <div className="space-y-1">
            {results.map((song) => (
              <SongCard key={song._id} song={song} songList={results} showAlbum />
            ))}
          </div>
        </div>
      )}

      {!loading && query && results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white text-xl font-bold mb-2">No results found for "{query}"</p>
          <p className="text-[#B3B3B3]">Try different keywords or check your spelling</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
