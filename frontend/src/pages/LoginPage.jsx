// LoginPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(form.email, form.password);
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#1DB954] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-black text-2xl font-bold">♫</span>
          </div>
          <h1 className="text-white text-2xl font-bold">Log in to Spotify</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[#B3B3B3] text-xs font-bold uppercase mb-2 block">Email address</label>
            <input
              type="email" required value={form.email}
              onChange={e => setForm(f => ({...f, email: e.target.value}))}
              placeholder="Email address"
              className="w-full bg-[#242424] border border-[#535353] text-white rounded-md px-4 py-3 text-sm outline-none focus:border-white placeholder-[#727272]"
            />
          </div>
          <div>
            <label className="text-[#B3B3B3] text-xs font-bold uppercase mb-2 block">Password</label>
            <input
              type="password" required value={form.password}
              onChange={e => setForm(f => ({...f, password: e.target.value}))}
              placeholder="Password"
              className="w-full bg-[#242424] border border-[#535353] text-white rounded-md px-4 py-3 text-sm outline-none focus:border-white placeholder-[#727272]"
            />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-[#1DB954] text-black font-bold py-3 rounded-full hover:bg-[#1ed760] transition disabled:opacity-50 text-sm mt-2">
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="text-center mt-8 border-t border-[#282828] pt-6">
          <p className="text-[#B3B3B3] text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-white font-bold underline hover:text-[#1DB954] transition">Sign up for Spotify</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
