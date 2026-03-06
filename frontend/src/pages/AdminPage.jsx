import { useState, useEffect } from 'react';
import { adminAPI, songsAPI, albumsAPI } from '../utils/api';
import { toast } from 'react-toastify';
import { HiUpload, HiTrash, HiUsers, HiMusicNote, HiCollection, HiShieldCheck } from 'react-icons/hi';

const AdminPage = () => {
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);

  // Upload song form
  const [songForm, setSongForm] = useState({ title: '', artist: '', genre: '', albumName: '', year: '', isDownloadable: true });
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Upload album form
  const [albumForm, setAlbumForm] = useState({ title: '', artist: '', genre: '', year: '' });
  const [albumCover, setAlbumCover] = useState(null);

  useEffect(() => {
    if (tab === 'dashboard') loadStats();
    if (tab === 'users') loadUsers();
    if (tab === 'songs') loadSongs();
    if (tab === 'albums') loadAlbums();
  }, [tab]);

  const loadStats = async () => {
    try { const { data } = await adminAPI.getStats(); setStats(data); } catch {}
  };

  const loadUsers = async () => {
    try { const { data } = await adminAPI.getUsers(); setUsers(data); } catch {}
  };

  const loadSongs = async () => {
    try { const { data } = await songsAPI.getAll({ limit: 50 }); setSongs(data.songs); } catch {}
  };

  const loadAlbums = async () => {
    try { const { data } = await albumsAPI.getAll(); setAlbums(data); } catch {}
  };

  const uploadSong = async () => {
    if (!songForm.title || !songForm.artist || !audioFile) {
      toast.error('Title, artist and audio file are required');
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      Object.entries(songForm).forEach(([k, v]) => fd.append(k, v));
      fd.append('audio', audioFile);
      if (coverFile) fd.append('cover', coverFile);
      await songsAPI.upload(fd);
      toast.success('Song uploaded! 🎵');
      setSongForm({ title: '', artist: '', genre: '', albumName: '', year: '', isDownloadable: true });
      setAudioFile(null); setCoverFile(null);
      loadSongs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally { setUploading(false); }
  };

  const deleteSong = async (id) => {
    if (!confirm('Delete this song?')) return;
    try {
      await songsAPI.delete(id);
      setSongs(s => s.filter(x => x._id !== id));
      toast.success('Song deleted');
    } catch { toast.error('Delete failed'); }
  };

  const uploadAlbum = async () => {
    if (!albumForm.title || !albumForm.artist) { toast.error('Title and artist required'); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      Object.entries(albumForm).forEach(([k, v]) => fd.append(k, v));
      if (albumCover) fd.append('cover', albumCover);
      await albumsAPI.create(fd);
      toast.success('Album created! 💿');
      setAlbumForm({ title: '', artist: '', genre: '', year: '' });
      setAlbumCover(null);
      loadAlbums();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setUploading(false); }
  };

  const deleteAlbum = async (id) => {
    if (!confirm('Delete this album?')) return;
    try {
      await albumsAPI.delete(id);
      setAlbums(a => a.filter(x => x._id !== id));
      toast.success('Album deleted');
    } catch { toast.error('Delete failed'); }
  };

  const changeUserRole = async (id, role) => {
    try {
      const { data } = await adminAPI.updateRole(id, role);
      setUsers(u => u.map(x => x._id === id ? data : x));
      toast.success('Role updated');
    } catch { toast.error('Failed'); }
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await adminAPI.deleteUser(id);
      setUsers(u => u.filter(x => x._id !== id));
      toast.success('User deleted');
    } catch { toast.error('Failed'); }
  };

  const tabs = [
    { key: 'dashboard', label: 'Dashboard', icon: HiShieldCheck },
    { key: 'songs', label: 'Songs', icon: HiMusicNote },
    { key: 'albums', label: 'Albums', icon: HiCollection },
    { key: 'users', label: 'Users', icon: HiUsers },
  ];

  const inputCls = "w-full bg-[#3e3e3e] text-white rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1DB954] placeholder-[#B3B3B3]";
  const labelCls = "text-[#B3B3B3] text-xs font-semibold uppercase mb-1 block";

  return (
    <div className="fade-in">
      <div className="flex items-center gap-3 mb-6">
        <HiShieldCheck className="text-[#1DB954]" size={28} />
        <h1 className="text-white text-3xl font-bold">Admin Panel</h1>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 mb-8 border-b border-[#282828] pb-4">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition ${tab === key ? 'bg-[#1DB954] text-black' : 'text-[#B3B3B3] hover:text-white hover:bg-[#282828]'}`}>
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {tab === 'dashboard' && stats && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: '👤', color: 'from-blue-600 to-blue-800' },
              { label: 'Total Songs', value: stats.totalSongs, icon: '🎵', color: 'from-green-600 to-green-800' },
              { label: 'Albums', value: stats.totalAlbums, icon: '💿', color: 'from-purple-600 to-purple-800' },
              { label: 'Playlists', value: stats.totalPlaylists, icon: '📋', color: 'from-orange-600 to-orange-800' },
            ].map(s => (
              <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-xl p-5`}>
                <span className="text-3xl">{s.icon}</span>
                <p className="text-white text-3xl font-bold mt-2">{s.value}</p>
                <p className="text-white/70 text-sm">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#181818] rounded-xl p-5">
              <h3 className="text-white font-bold mb-4">Top Songs</h3>
              <div className="space-y-3">
                {stats.topSongs?.map((song, i) => (
                  <div key={song._id} className="flex items-center gap-3">
                    <span className="text-[#B3B3B3] w-5 text-sm">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{song.title}</p>
                      <p className="text-[#B3B3B3] text-xs">{song.artist}</p>
                    </div>
                    <span className="text-[#1DB954] text-xs">{song.plays} plays</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#181818] rounded-xl p-5">
              <h3 className="text-white font-bold mb-4">Recent Users</h3>
              <div className="space-y-3">
                {stats.recentUsers?.map(u => (
                  <div key={u._id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#282828] flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {u.name[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{u.name}</p>
                      <p className="text-[#B3B3B3] text-xs">{u.email}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-[#1DB954]/20 text-[#1DB954]' : 'bg-[#282828] text-[#B3B3B3]'}`}>{u.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Song */}
      {tab === 'songs' && (
        <div className="space-y-6">
          <div className="bg-[#181818] rounded-xl p-6">
            <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2"><HiUpload /> Upload New Song</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className={labelCls}>Title *</label><input className={inputCls} value={songForm.title} onChange={e => setSongForm(f => ({...f, title: e.target.value}))} placeholder="Song title" /></div>
              <div><label className={labelCls}>Artist *</label><input className={inputCls} value={songForm.artist} onChange={e => setSongForm(f => ({...f, artist: e.target.value}))} placeholder="Artist name" /></div>
              <div><label className={labelCls}>Genre</label><input className={inputCls} value={songForm.genre} onChange={e => setSongForm(f => ({...f, genre: e.target.value}))} placeholder="Pop, Rock, Hip-Hop..." /></div>
              <div><label className={labelCls}>Album Name</label><input className={inputCls} value={songForm.albumName} onChange={e => setSongForm(f => ({...f, albumName: e.target.value}))} placeholder="Album name" /></div>
              <div><label className={labelCls}>Year</label><input className={inputCls} type="number" value={songForm.year} onChange={e => setSongForm(f => ({...f, year: e.target.value}))} placeholder="2024" /></div>
              <div className="flex items-center gap-3 mt-5">
                <input type="checkbox" id="dl" checked={songForm.isDownloadable} onChange={e => setSongForm(f => ({...f, isDownloadable: e.target.checked}))} className="accent-[#1DB954]" />
                <label htmlFor="dl" className="text-[#B3B3B3] text-sm">Allow Download</label>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className={labelCls}>Audio File * (MP3, WAV)</label>
                <input type="file" accept="audio/*" onChange={e => setAudioFile(e.target.files[0])} className="w-full text-[#B3B3B3] text-sm file:bg-[#282828] file:text-white file:border-none file:rounded file:px-4 file:py-2 file:cursor-pointer file:mr-3" />
                {audioFile && <p className="text-[#1DB954] text-xs mt-1">✓ {audioFile.name}</p>}
              </div>
              <div>
                <label className={labelCls}>Cover Image (JPG, PNG)</label>
                <input type="file" accept="image/*" onChange={e => setCoverFile(e.target.files[0])} className="w-full text-[#B3B3B3] text-sm file:bg-[#282828] file:text-white file:border-none file:rounded file:px-4 file:py-2 file:cursor-pointer file:mr-3" />
                {coverFile && <p className="text-[#1DB954] text-xs mt-1">✓ {coverFile.name}</p>}
              </div>
            </div>
            <button onClick={uploadSong} disabled={uploading}
              className="mt-5 bg-[#1DB954] text-black font-bold px-8 py-2.5 rounded-full text-sm hover:bg-[#1ed760] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              {uploading ? <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"/> Uploading...</> : <><HiUpload size={16}/> Upload Song</>}
            </button>
          </div>

          {/* Song list */}
          <div className="bg-[#181818] rounded-xl p-6">
            <h2 className="text-white font-bold text-lg mb-4">All Songs ({songs.length})</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {songs.map(song => (
                <div key={song._id} className="flex items-center gap-4 p-3 rounded-md hover:bg-[#282828] transition">
                  <div className="w-10 h-10 rounded bg-[#282828] overflow-hidden shrink-0">
                    {song.coverImage ? <img src={song.coverImage} alt="" className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-lg">🎵</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{song.title}</p>
                    <p className="text-[#B3B3B3] text-xs">{song.artist} · {song.plays} plays</p>
                  </div>
                  <button onClick={() => deleteSong(song._id)} className="text-red-400 hover:text-red-300 transition p-1 rounded">
                    <HiTrash size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Albums */}
      {tab === 'albums' && (
        <div className="space-y-6">
          <div className="bg-[#181818] rounded-xl p-6">
            <h2 className="text-white font-bold text-lg mb-5">Create Album</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className={labelCls}>Title *</label><input className={inputCls} value={albumForm.title} onChange={e => setAlbumForm(f => ({...f, title: e.target.value}))} placeholder="Album title" /></div>
              <div><label className={labelCls}>Artist *</label><input className={inputCls} value={albumForm.artist} onChange={e => setAlbumForm(f => ({...f, artist: e.target.value}))} placeholder="Artist name" /></div>
              <div><label className={labelCls}>Genre</label><input className={inputCls} value={albumForm.genre} onChange={e => setAlbumForm(f => ({...f, genre: e.target.value}))} placeholder="Genre" /></div>
              <div><label className={labelCls}>Year</label><input className={inputCls} type="number" value={albumForm.year} onChange={e => setAlbumForm(f => ({...f, year: e.target.value}))} /></div>
            </div>
            <div className="mt-4">
              <label className={labelCls}>Cover Image</label>
              <input type="file" accept="image/*" onChange={e => setAlbumCover(e.target.files[0])} className="text-[#B3B3B3] text-sm file:bg-[#282828] file:text-white file:border-none file:rounded file:px-4 file:py-2 file:cursor-pointer file:mr-3" />
            </div>
            <button onClick={uploadAlbum} disabled={uploading}
              className="mt-5 bg-[#1DB954] text-black font-bold px-8 py-2.5 rounded-full text-sm hover:bg-[#1ed760] transition disabled:opacity-50">
              {uploading ? 'Creating...' : 'Create Album'}
            </button>
          </div>

          <div className="bg-[#181818] rounded-xl p-6">
            <h2 className="text-white font-bold text-lg mb-4">All Albums ({albums.length})</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
              {albums.map(album => (
                <div key={album._id} className="relative group bg-[#282828] rounded-lg p-3">
                  <div className="aspect-square rounded overflow-hidden bg-[#383838] mb-2">
                    {album.coverImage ? <img src={album.coverImage} alt="" className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-3xl">💿</div>}
                  </div>
                  <p className="text-white text-xs font-bold truncate">{album.title}</p>
                  <p className="text-[#B3B3B3] text-xs truncate">{album.artist}</p>
                  <button onClick={() => deleteAlbum(album._id)} className="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100 transition bg-black/50 p-1 rounded">
                    <HiTrash size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users */}
      {tab === 'users' && (
        <div className="bg-[#181818] rounded-xl p-6">
          <h2 className="text-white font-bold text-lg mb-4">All Users ({users.length})</h2>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {users.map(u => (
              <div key={u._id} className="flex items-center gap-4 p-3 rounded-md hover:bg-[#282828] transition">
                <div className="w-10 h-10 rounded-full bg-[#282828] flex items-center justify-center text-white font-bold shrink-0">
                  {u.name[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold">{u.name}</p>
                  <p className="text-[#B3B3B3] text-xs">{u.email}</p>
                </div>
                <select
                  value={u.role}
                  onChange={e => changeUserRole(u._id, e.target.value)}
                  className="bg-[#282828] text-white text-xs px-3 py-1.5 rounded border border-[#535353] outline-none focus:border-[#1DB954]"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <button onClick={() => deleteUser(u._id)} className="text-red-400 hover:text-red-300 transition p-1">
                  <HiTrash size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
