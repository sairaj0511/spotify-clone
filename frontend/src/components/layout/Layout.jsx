import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Player from '../player/Player';
import Topbar from './Topbar';

const Layout = () => {
  return (
    <div className="flex flex-col h-screen bg-[#121212] overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />
        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto bg-gradient-to-b from-[#1a1a2e] to-[#121212]">
            <div className="p-6 pb-4">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      {/* Bottom Player */}
      <Player />
    </div>
  );
};

export default Layout;
