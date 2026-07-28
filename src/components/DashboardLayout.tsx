import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Sidebar, NavTabId } from './Sidebar';
import { Header } from './Header';
import { DashboardView } from './DashboardView';
import { PlaceholderView } from './PlaceholderView';
import { UserCoordinator } from '../types';

interface DashboardLayoutProps {
  user: UserCoordinator | null;
  onLogout: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  user,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<NavTabId>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-slate-800 flex flex-row overflow-x-hidden font-sans">
      {/* Desktop Sidebar (Fixed Left) */}
      <div className="hidden md:block h-screen sticky top-0 z-40">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onLogout={onLogout}
        />
      </div>

      {/* Mobile Drawer Overlay Sidebar */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 md:hidden"
            />

            {/* Slide-over Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 z-50 md:hidden shadow-2xl"
            >
              <Sidebar
                activeTab={activeTab}
                onSelectTab={setActiveTab}
                onLogout={onLogout}
                onCloseMobile={() => setIsMobileSidebarOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Container Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Header */}
        <Header
          activeTab={activeTab}
          user={user}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onSelectTab={setActiveTab}
          onLogout={onLogout}
        />

        {/* Dynamic Page Content View */}
        <main className="flex-1 flex flex-col min-w-0 pb-12">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full flex-1"
              >
                <DashboardView onNavigateTab={setActiveTab} />
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full flex-1 flex flex-col"
              >
                <PlaceholderView
                  tabId={activeTab}
                  onReturnToDashboard={() => setActiveTab('dashboard')}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
