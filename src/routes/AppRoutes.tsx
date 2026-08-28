import { Navigate, Route, Routes } from "react-router-dom";

import { LoginPage } from "../pages/auth/LoginPage";
import { ForgotPasswordPage } from "../pages/auth/ForgotPasswordPage";

import { ROUTES } from "./routePaths";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />

      <Route path={ROUTES.LOGIN} element={<LoginPage />} />

      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />

      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  );
}
