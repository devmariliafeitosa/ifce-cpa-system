import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AuthView, AuthState } from './types';
import { LoginScreen } from './components/LoginScreen';
import { ForgotPasswordScreen } from './components/ForgotPasswordScreen';
import { ResetPasswordScreen } from './components/ResetPasswordScreen';
import { DashboardLayout } from './components/DashboardLayout';
import { Footer } from './components/Footer';

// Route hash mappings
const ROUTE_MAP: Record<string, AuthView> = {
  '#login': 'login',
  '#esqueci-senha': 'forgot-password',
  '#recuperar-senha': 'forgot-password',
  '#forgot-password': 'forgot-password',
  '#redefinir-senha': 'reset-password',
  '#reset-password': 'reset-password',
  '#resetar-senha': 'reset-password',
};

const VIEW_HASH_MAP: Record<AuthView, string> = {
  login: '#login',
  'forgot-password': '#esqueci-senha',
  'reset-password': '#redefinir-senha',
  register: '#login',
};

const getInitialViewFromURL = (): AuthView => {
  const hash = window.location.hash.toLowerCase();
  if (ROUTE_MAP[hash]) {
    return ROUTE_MAP[hash];
  }
  const path = window.location.pathname.toLowerCase();
  if (path.includes('redefinir') || path.includes('reset')) return 'reset-password';
  if (path.includes('esqueci') || path.includes('recuperar')) return 'forgot-password';
  return 'login';
};

export default function App() {
  const [authState, setAuthState] = useState<AuthState>({
    currentView: getInitialViewFromURL(),
    rememberMe: false,
    prefilledEmail: '',
    loggedInUser: null,
    registrationSuccessMessage: null,
    recoverySuccessMessage: null,
  });

  // Sync state when URL hash changes (browser back/forward or direct bookmark)
  useEffect(() => {
    const handleURLChange = () => {
      const targetView = getInitialViewFromURL();
      setAuthState((prev) => {
        if (prev.currentView !== targetView) {
          return { ...prev, currentView: targetView };
        }
        return prev;
      });
    };

    window.addEventListener('hashchange', handleURLChange);
    window.addEventListener('popstate', handleURLChange);
    return () => {
      window.removeEventListener('hashchange', handleURLChange);
      window.removeEventListener('popstate', handleURLChange);
    };
  }, []);

  const handleNavigate = (view: AuthView) => {
    const targetHash = VIEW_HASH_MAP[view];
    if (window.location.hash !== targetHash) {
      window.history.pushState(null, '', targetHash);
    }

    setAuthState((prev) => ({
      ...prev,
      currentView: view,
      registrationSuccessMessage: view === 'login' ? prev.registrationSuccessMessage : null,
    }));
  };

  const handleLoginSuccess = (userEmail: string) => {
    setAuthState((prev) => ({
      ...prev,
      loggedInUser: {
        id: '1',
        name: 'Coordenador CPA Tauá',
        email: userEmail,
        campus: 'Campus Tauá',
        siape: '1982736',
        createdAt: new Date().toISOString(),
      },
      registrationSuccessMessage: null,
    }));
  };

  const handleRegisterSuccess = (email: string, message: string) => {
    window.history.pushState(null, '', VIEW_HASH_MAP['login']);
    setAuthState((prev) => ({
      ...prev,
      currentView: 'login',
      prefilledEmail: email,
      registrationSuccessMessage: message,
    }));
  };

  const handleLogout = () => {
    setAuthState((prev) => ({
      ...prev,
      loggedInUser: null,
    }));
  };

  // If logged in, show the complete CPA IFCE Coordinator Dashboard
  if (authState.loggedInUser) {
    return (
      <DashboardLayout
        user={authState.loggedInUser}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-slate-800 antialiased font-sans overflow-x-hidden flex flex-col justify-between">
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center items-center">
        {/* Active Screen View based on AuthState with Smooth Motion Transitions */}
        <AnimatePresence mode="wait">
          {authState.currentView === 'login' && (
            <motion.div
              key="login"
              className="w-full flex justify-center my-auto"
              initial={{ opacity: 0, y: 12, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.99 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <LoginScreen
                onNavigate={handleNavigate}
                onLoginSuccess={handleLoginSuccess}
                prefilledEmail={authState.prefilledEmail}
                registrationSuccessMessage={authState.registrationSuccessMessage}
              />
            </motion.div>
          )}

          {authState.currentView === 'forgot-password' && (
            <motion.div
              key="forgot-password"
              className="w-full flex justify-center my-auto"
              initial={{ opacity: 0, y: 12, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.99 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <ForgotPasswordScreen
                onNavigate={handleNavigate}
                prefilledEmail={authState.prefilledEmail}
              />
            </motion.div>
          )}

          {authState.currentView === 'reset-password' && (
            <motion.div
              key="reset-password"
              className="w-full flex justify-center my-auto"
              initial={{ opacity: 0, y: 12, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.99 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <ResetPasswordScreen onNavigate={handleNavigate} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Institutional CPA & IFCE Footer */}
      <Footer />
    </div>
  );
}

