export const ROUTES = {
  LOGIN: "/login",
  FORGOT_PASSWORD: "/esqueci-senha",
  RESET_PASSWORD: "/redefinir-senha",
  DASHBOARD: "/dashboard",
  PROFILE: "/perfil",
  RESPOND: "/responder/:token",
} as const;

// Helper to build a concrete participant response URL for a given campaign.
export const buildRespondPath = (campaignToken: string) =>
  `/responder/${campaignToken}`;
