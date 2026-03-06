import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register, loading } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    await register(form.name, form.email, form.password);
  };

  const input = "w-full bg-[#242424] border border-[#535353] text-white rounded-md px-4 py-3 text-sm outline-none focus:border-white placeholder-[#727272]";
  const label = "text-[#B3B3B3] text-xs font-bold uppercase mb-2 block";

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#1DB954] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-black text-2xl font-bold">♫</span>
          </div>
          <h1 className="text-white text-2xl font-bold">Sign up for free</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={label}>What's your name?</label>
            <input type="text" required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Enter your name" className={input} />
          </div>
          <div>
            <label className={label}>What's your email?</label>
            <input type="email" required value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} placeholder="Enter your email" className={input} />
          </div>
          <div>
            <label className={label}>Create a password</label>
            <input type="password" required value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} placeholder="Create a password" className={input} />
          </div>
          <div>
            <label className={label}>Confirm password</label>
            <input type="password" required value={form.confirm} onChange={e => setForm(f => ({...f, confirm: e.target.value}))} placeholder="Confirm password" className={input} />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-[#1DB954] text-black font-bold py-3 rounded-full hover:bg-[#1ed760] transition disabled:opacity-50 text-sm mt-2">
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center mt-8 border-t border-[#282828] pt-6">
          <p className="text-[#B3B3B3] text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-white font-bold underline hover:text-[#1DB954] transition">Log in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
