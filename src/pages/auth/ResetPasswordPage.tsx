import { useNavigate } from "react-router-dom";

import { Footer } from "../../components/auth/Footer";
import { ResetPasswordForm } from "../../components/auth/ResetPasswordForm";

import { ROUTES } from "../../routes/routePaths";

export function ResetPasswordPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4">
        <ResetPasswordForm
          onBackToLogin={() => navigate(ROUTES.LOGIN)}
          onRequestNewLink={() => navigate(ROUTES.FORGOT_PASSWORD)}
        />
      </main>

      <Footer />
    </div>
  );
}
