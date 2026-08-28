import { Navigate, Route, Routes } from "react-router-dom";

import { ForgotPasswordPage } from "../pages/auth/ForgotPasswordPage";
import { LoginPage } from "../pages/auth/LoginPage";
import { ResetPasswordPage } from "../pages/auth/ResetPasswordPage";

import { ROUTES } from "./routePaths";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />

      <Route path={ROUTES.LOGIN} element={<LoginPage />} />

      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />

      <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />

      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  );
}
