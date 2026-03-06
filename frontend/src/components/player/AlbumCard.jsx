import { useNavigate } from 'react-router-dom';
import { HiPlay } from 'react-icons/hi';
import { usePlayer } from '../../context/PlayerContext';

const AlbumCard = ({ album }) => {
  const navigate = useNavigate();
  const { playSong } = usePlayer();

  const handlePlay = (e) => {
    e.stopPropagation();
    if (album.songs?.length > 0) {
      playSong(album.songs[0], album.songs);
    }
  };

  return (
    <div
      className="bg-[#181818] rounded-lg p-4 cursor-pointer hover:bg-[#282828] transition-colors group card-hover"
      onClick={() => navigate(`/album/${album._id}`)}
    >
      <div className="relative mb-4">
        <div className="aspect-square rounded-md overflow-hidden bg-[#282828]">
          {album.coverImage ? (
            <img src={album.coverImage} alt={album.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">💿</div>
          )}
        </div>
        <button
          onClick={handlePlay}
          className="absolute bottom-2 right-2 w-10 h-10 bg-[#1DB954] rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all"
        >
          <HiPlay className="text-black ml-0.5" size={20} />
        </button>
      </div>
      <h3 className="text-white font-bold text-sm truncate">{album.title}</h3>
      <p className="text-[#B3B3B3] text-xs mt-1 truncate">{album.artist} · {album.year}</p>
    </div>
  );
};

export default AlbumCard;
