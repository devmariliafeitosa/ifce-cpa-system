import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Sidebar, NavTabId } from './Sidebar';
import { Header } from './Header';
import { DashboardView } from './DashboardView';
import { PlaceholderView } from './PlaceholderView';
import { GoogleFormsManager } from './GoogleFormsManager';
import { FormsManagerView } from './FormsManagerView';
import { ReportsView } from './ReportsView';
import { ParticipantsView } from './ParticipantsView';
import { FormResultsView } from './FormResultsView';
import { SettingsView } from './SettingsView';
import { ProfileView } from './ProfileView';
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
    <div className="min-h-screen bg-[#F7F8FA] text-slate-800 font-sans relative">
      {/* Desktop Sidebar (Permanently Fixed to Viewport) */}
      <div className="hidden md:block fixed top-0 left-0 w-[260px] h-screen z-40">
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

      {/* Main Container Area (Offset by Sidebar width on desktop) */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen md:ml-[260px]">
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
                className="w-full flex-1 flex flex-col"
              >
                <DashboardView onNavigateTab={setActiveTab} />
              </motion.div>
            ) : activeTab === 'formularios' ? (
              <motion.div
                key="formularios"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full flex-1 flex flex-col"
              >
                <FormsManagerView
                  onReturnToDashboard={() => setActiveTab('dashboard')}
                  onSelectTab={setActiveTab}
                />
              </motion.div>
            ) : activeTab === 'relatorios' ? (
              <motion.div
                key="relatorios"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full flex-1 flex flex-col"
              >
                <ReportsView onReturnToDashboard={() => setActiveTab('dashboard')} />
              </motion.div>
            ) : activeTab === 'google-forms' || activeTab === 'novo-formulario' ? (
              <motion.div
                key="google-forms"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full flex-1 flex flex-col"
              >
                <GoogleFormsManager onReturnToDashboard={() => setActiveTab('dashboard')} />
              </motion.div>
            ) : activeTab === 'participantes' || activeTab === 'alunos' || activeTab === 'docentes' || activeTab === 'taes' ? (
              <motion.div
                key="participantes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full flex-1 flex flex-col"
              >
                <ParticipantsView />
              </motion.div>
            ) : activeTab === 'configuracoes' ? (
              <motion.div
                key="configuracoes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full flex-1 flex flex-col"
              >
                <SettingsView onReturnToDashboard={() => setActiveTab('dashboard')} />
              </motion.div>
            ) : activeTab === 'perfil' ? (
              <motion.div
                key="perfil"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full flex-1 flex flex-col"
              >
                <ProfileView user={user} onReturnToDashboard={() => setActiveTab('dashboard')} />
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
                  onSelectTab={setActiveTab}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
