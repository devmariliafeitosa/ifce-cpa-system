import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { ReportsView } from "../../components/reports/ReportsView";
import { Footer } from "../../components/auth/Footer";
import { DashboardView } from "../../components/DashboardView";
import { FormsManagerView } from "../../components/FormsManagerView";
import { Header } from "../../components/Header";
import { ParticipantsView } from "../../components/ParticipantsView";
import { PlaceholderView } from "../../components/PlaceholderView";
import { ProfileView } from "../../components/profile/ProfileView";
import { SettingsView } from "../../components/settings/SettingsView";
import { Sidebar } from "../../components/Sidebar";

import type { NavTabId } from "../../components/navigation/navigationTypes";
import type { UserCoordinator } from "../../types";

interface DashboardPageProps {
  user: UserCoordinator | null;
  onLogout: () => void;
}

export function DashboardPage({ user, onLogout }: DashboardPageProps) {
  const [activeTab, setActiveTab] = useState<NavTabId>("dashboard");

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardView onNavigateTab={setActiveTab} />;

      case "formularios":
        return (
          <FormsManagerView
            onReturnToDashboard={() => setActiveTab("dashboard")}
            onSelectTab={(tab) => setActiveTab(tab as NavTabId)}
          />
        );

      case "participantes":
        return <ParticipantsView />;

      case "relatorios":
        return (
          <ReportsView onReturnToDashboard={() => setActiveTab("dashboard")} />
        );
      case "configuracoes":
        return (
          <SettingsView onReturnToDashboard={() => setActiveTab("dashboard")} />
        );

      case "perfil":
        return (
          <ProfileView
            user={user}
            onReturnToDashboard={() => setActiveTab("dashboard")}
          />
        );

      default:
        return (
          <PlaceholderView
            tabId={activeTab}
            onReturnToDashboard={() => setActiveTab("dashboard")}
            onSelectTab={setActiveTab}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-slate-800 antialiased font-sans relative flex flex-col">
      <div className="flex flex-1 min-w-0">
        <aside className="hidden md:block fixed top-0 left-0 w-[260px] h-screen z-40">
          <Sidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            onLogout={onLogout}
          />
        </aside>

        <div className="flex-1 flex flex-col min-w-0 md:ml-[260px]">
          <Header
            activeTab={activeTab}
            user={user}
            onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
            onSelectTab={setActiveTab}
            onLogout={onLogout}
          />

          <main className="flex-1 flex flex-col min-w-0 pb-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                }}
                transition={{
                  duration: 0.2,
                }}
                className="w-full flex-1 flex flex-col"
              >
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </main>

          <Footer />
        </div>
      </div>

      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 md:hidden"
            />

            <motion.div
              initial={{
                x: "-100%",
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: "-100%",
              }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 220,
              }}
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
    </div>
  );
}
