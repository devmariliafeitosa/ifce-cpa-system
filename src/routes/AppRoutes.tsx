import type { ReactElement } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

import { ForgotPasswordPage } from "../pages/auth/ForgotPasswordPage";
import { LoginPage } from "../pages/auth/LoginPage";
import { ResetPasswordPage } from "../pages/auth/ResetPasswordPage";
import { DashboardPage } from "../pages/DashboardPage/DashboardPage";
import { ProfilePage } from "../pages/profile/ProfilePage";
import { RespondPage } from "../pages/respond/RespondPage";

import { getAuthToken } from "../services/api";
import {
  getCurrentStoredUser,
  logout,
} from "../services/auth.service";

import { ROUTES } from "./routePaths";

// Rota protegida: só renderiza se houver token salvo, senão manda pro login.
function RequireAuth({ children }: { children: ReactElement }) {
  const isAuthenticated = Boolean(getAuthToken());

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
}

export function AppRoutes() {
  const navigate = useNavigate();

  const handleLogout = () => {
    void logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const loggedInUser = getCurrentStoredUser();

  return (
    <Routes>
      <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />

      <Route path={ROUTES.LOGIN} element={<LoginPage />} />

      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />

      <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />

      <Route
        path={ROUTES.DASHBOARD}
        element={
          <RequireAuth>
            <DashboardPage user={loggedInUser} onLogout={handleLogout} />
          </RequireAuth>
        }
      />

      <Route
        path={ROUTES.PROFILE}
        element={
          <RequireAuth>
            <ProfilePage />
          </RequireAuth>
        }
      />

      <Route path={ROUTES.RESPOND} element={<RespondPage />} />

      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  );
}
