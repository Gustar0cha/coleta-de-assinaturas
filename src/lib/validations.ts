import { z } from "zod";
import { isValidCpf, onlyDigits } from "@/lib/cpf";

export const signatureSchema = z.object({
  name: z
    .string()
    .trim()
    .min(5, "Informe seu nome completo.")
    .refine((name) => name.split(/\s+/).filter(Boolean).length >= 2, {
      message: "Informe nome e sobrenome.",
    }),
  cpf: z
    .string()
    .transform(onlyDigits)
    .refine(isValidCpf, "Informe um CPF valido."),
});

export type SignatureInput = z.input<typeof signatureSchema>;
export type SignaturePayload = z.output<typeof signatureSchema>;
