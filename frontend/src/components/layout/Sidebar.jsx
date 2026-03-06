import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { HiHome, HiSearch, HiCollection, HiHeart, HiPlus, HiLogout, HiShieldCheck, HiGlobe } from 'react-icons/hi';
import { playlistsAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { usePlayer } from '../../context/PlayerContext';
import { toast } from 'react-toastify';

const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { playSong } = usePlayer();
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const { data } = await playlistsAPI.getMy();
      setPlaylists(data);
    } catch { }
  };

  const createPlaylist = async () => {
    if (creating) return;
    setCreating(true);
    try {
      const { data } = await playlistsAPI.create({ name: `My Playlist #${playlists.length + 1}` });
      setPlaylists((prev) => [...prev, data]);
      navigate(`/playlist/${data._id}`);
      toast.success('Playlist created!');
    } catch {
      toast.error('Failed to create playlist');
    } finally {
      setCreating(false);
    }
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-4 px-3 py-2 rounded-md text-sm font-semibold transition-colors ${isActive ? 'text-white' : 'text-[#B3B3B3] hover:text-white'}`;

  return (
    <div className="w-64 bg-black flex flex-col h-full shrink-0">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#1DB954] rounded-full flex items-center justify-center">
            <span className="text-black font-bold text-xs">♫</span>
          </div>
          <span className="text-white font-bold text-xl">Spotify</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="px-3 space-y-1">
        <NavLink to="/" end className={navClass}>
          <HiHome size={24} /> Home
        </NavLink>
        <NavLink to="/search" className={navClass}>
          <HiSearch size={24} /> Search
        </NavLink>
        <NavLink to="/library" className={navClass}>
          <HiCollection size={24} /> Your Library
        </NavLink>
        <NavLink to="/discover" className={navClass}>
          <HiGlobe size={24} /> Discover
        </NavLink>
        {isAdmin && (
          <NavLink to="/admin" className={navClass}>
            <HiShieldCheck size={24} /> Admin Panel
          </NavLink>
        )}
      </nav>

      {/* Divider */}
      <div className="border-t border-[#282828] my-4 mx-3" />

      {/* Playlist section */}
      <div className="px-3 space-y-1">
        <button
          onClick={createPlaylist}
          className="flex items-center gap-4 px-3 py-2 text-[#B3B3B3] hover:text-white text-sm font-semibold transition-colors w-full"
        >
          <div className="w-6 h-6 bg-[#B3B3B3] rounded-sm flex items-center justify-center">
            <HiPlus className="text-black" size={14} />
          </div>
          Create Playlist
        </button>
        <NavLink to="/liked" className={navClass}>
          <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-blue-300 rounded-sm flex items-center justify-center">
            <HiHeart className="text-white" size={12} />
          </div>
          Liked Songs
        </NavLink>
      </div>

      {/* Divider */}
      <div className="border-t border-[#282828] my-4 mx-3" />

      {/* User Playlists */}
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {playlists.map((pl) => (
          <NavLink
            key={pl._id}
            to={`/playlist/${pl._id}`}
            className={({ isActive }) =>
              `block px-3 py-1.5 text-sm transition-colors truncate ${isActive ? 'text-white' : 'text-[#B3B3B3] hover:text-white'}`
            }
          >
            {pl.name}
          </NavLink>
        ))}
      </div>

      {/* User info at bottom */}
      <div className="p-4 border-t border-[#282828] flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[#535353] flex items-center justify-center shrink-0 overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-xs font-bold">{user?.name?.[0]?.toUpperCase()}</span>
            )}
          </div>
          <span className="text-white text-sm font-semibold truncate">{user?.name}</span>
        </div>
        <button onClick={logout} className="text-[#B3B3B3] hover:text-white transition-colors">
          <HiLogout size={18} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
