import { useNavigate } from "react-router-dom";

import { Footer } from "../../components/auth/Footer";
import { LoginBrandPanel } from "../../features/auth/components/LoginBrandPanel";
import { LoginForm } from "../../features/auth/components/LoginForm";

import type { AuthView } from "../../features/auth/types/auth.types";

import { ROUTES } from "../../routes/routePaths";

export function LoginPage() {
  const navigate = useNavigate();

  const handleNavigate = (view: AuthView) => {
    if (view === "forgot-password") {
      navigate(ROUTES.FORGOT_PASSWORD);
    }
  };

  const handleLoginSuccess = () => {
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-slate-800 antialiased font-sans overflow-x-hidden flex flex-col">
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full flex items-center justify-center p-3 md:p-6 lg:p-8 py-6 sm:py-10">
          <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[640px]">
            <LoginForm
              onNavigate={handleNavigate}
              onLoginSuccess={handleLoginSuccess}
            />

            <LoginBrandPanel />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
