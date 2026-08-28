import { useState } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { Footer } from "./components/Footer";
import type { AuthView } from "./types";

function App() {
  const [loggedInEmail, setLoggedInEmail] = useState<string | null>(null);

  const handleNavigate = (view: AuthView) => {
    if (view === "forgot-password") {
      alert("A recuperação de senha será implementada depois.");
    }
  };

  const handleLoginSuccess = (userEmail: string) => {
    setLoggedInEmail(userEmail);
  };

  if (loggedInEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA]">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-lg text-center">
          <h1 className="text-2xl font-bold text-[#0B7A3E]">
            Login realizado com sucesso
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Usuário: {loggedInEmail}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-slate-800 antialiased font-sans overflow-x-hidden flex flex-col justify-between">
      <main className="flex-1 flex flex-col justify-center items-center">
        <div className="w-full flex justify-center my-auto">
          <LoginScreen
            onNavigate={handleNavigate}
            onLoginSuccess={handleLoginSuccess}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
