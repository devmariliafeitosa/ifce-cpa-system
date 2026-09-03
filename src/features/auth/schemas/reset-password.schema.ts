import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "A senha deve possuir no mínimo 8 caracteres.")
      .regex(/[A-Z]/, "A senha deve possuir pelo menos uma letra maiúscula.")
      .regex(/[a-z]/, "A senha deve possuir pelo menos uma letra minúscula.")
      .regex(/[0-9]/, "A senha deve possuir pelo menos um número.")
      .regex(
        /[^A-Za-z0-9\s]/,
        "A senha deve possuir pelo menos um caractere especial.",
      ),

    confirmPassword: z.string().min(1, "Confirme sua nova senha."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas informadas não coincidem.",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
