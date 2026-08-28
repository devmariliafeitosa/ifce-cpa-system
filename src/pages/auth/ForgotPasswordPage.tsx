import { useNavigate } from "react-router-dom";

import { Footer } from "../../components/Footer";
import { ForgotPasswordForm } from "../../features/auth/components/ForgotPasswordForm";

import { ROUTES } from "../../routes/routePaths";

export function ForgotPasswordPage() {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4">
        <ForgotPasswordForm onBackToLogin={handleBackToLogin} />
      </main>

      <Footer />
    </div>
  );
}
