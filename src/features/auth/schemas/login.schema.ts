import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Informe seu e-mail institucional.")
    .email("E-mail em formato inválido.")
    .refine((value) => value.trim().toLowerCase().endsWith("@ifce.edu.br"), {
      message: "Utilize um e-mail institucional do IFCE.",
    }),

  password: z.string().min(1, "Informe sua senha de acesso."),

  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
