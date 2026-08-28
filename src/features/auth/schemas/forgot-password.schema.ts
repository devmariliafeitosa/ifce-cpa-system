import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Informe seu e-mail institucional.")
    .email("Informe um e-mail válido.")
    .refine((email) => email.trim().toLowerCase().endsWith("@ifce.edu.br"), {
      message: "Utilize um e-mail institucional do IFCE.",
    }),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
