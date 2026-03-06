import { useNavigate } from 'react-router-dom';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

const Topbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-transparent">
      {/* Nav arrows */}
      <div className="flex gap-2">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition"
        >
          <HiChevronLeft size={20} />
        </button>
        <button
          onClick={() => navigate(1)}
          className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition"
        >
          <HiChevronRight size={20} />
        </button>
      </div>

      {/* User badge */}
      <div className="flex items-center gap-2 bg-black/40 rounded-full px-3 py-1.5">
        <div className="w-6 h-6 rounded-full bg-[#535353] flex items-center justify-center overflow-hidden">
          {user?.avatar ? (
            <img src={user.avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-white text-xs font-bold">{user?.name?.[0]?.toUpperCase()}</span>
          )}
        </div>
        <span className="text-white text-sm font-semibold">{user?.name}</span>
      </div>
    </div>
  );
};

export default Topbar;
