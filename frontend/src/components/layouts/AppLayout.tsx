import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';

export const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#ECE7F6] relative overflow-hidden flex items-center justify-center p-0 md:p-3 lg:p-4 selection:bg-purple-200">
      {/* Ambient background pastel blobs matching the reference design */}
      <div className="absolute top-0 right-0 w-[420px] h-[360px] bg-[#FED7AA]/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 transform rotate-12"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-[#D8B4FE]/35 rounded-full blur-3xl pointer-events-none -ml-28 -mb-28"></div>
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-[#C4B5FD]/25 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main floating container matching the screenshot */}
      <div className="w-full max-w-[1680px] h-screen md:h-[calc(100vh-1.5rem)] bg-[#F8F9FD] md:rounded-[2rem] shadow-2xl md:border md:border-white/80 flex overflow-hidden relative z-10">
        {/* Sidebar for Desktop */}
        <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />

        {/* Mobile Drawer */}
        <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F8F9FD]">
          <Header onOpenMobileNav={() => setMobileNavOpen(true)} />

          <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6 bg-[#F8F9FD]">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
