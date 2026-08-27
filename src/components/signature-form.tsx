"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { CpfInput } from "@/components/cpf-input";
import { ConfirmationStep } from "@/components/confirmation-step";
import { SuccessState } from "@/components/success-state";
import { Button } from "@/components/ui/button";
import { formatCpf } from "@/lib/cpf";
import {
  signatureSchema,
  type SignatureInput,
  type SignaturePayload,
} from "@/lib/validations";

type Step = "form" | "confirm" | "success";

const errorMessages: Record<string, string> = {
  CPF_ALREADY_EXISTS: "Este CPF ja foi cadastrado.",
  INVALID_CPF: "Informe um CPF valido.",
  INVALID_NAME: "Informe seu nome completo.",
  RATE_LIMITED: "Muitas tentativas em pouco tempo. Aguarde um instante e tente novamente.",
  DUPLICATE_REQUEST: "Este envio ja esta em andamento.",
  CONFIGURATION_ERROR: "Nao foi possivel registrar agora. Tente novamente mais tarde.",
  INTERNAL_ERROR: "Nao foi possivel registrar agora. Verifique sua conexao e tente novamente.",
};

export function SignatureForm() {
  const [step, setStep] = useState<Step>("form");
  const [payload, setPayload] = useState<SignaturePayload | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm<SignatureInput>({
    resolver: zodResolver(signatureSchema),
    mode: "onChange",
    defaultValues: { name: "", cpf: "" },
  });

  const { ref: registerNameRef, ...nameField } = register("name");
  const cpf = useWatch({ control, name: "cpf" });

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  useEffect(() => {
    if (step === "success") {
      window.history.replaceState(null, "", window.location.href);
    }
  }, [step]);

  function moveToConfirm(data: SignaturePayload) {
    setSubmitError("");
    setPayload(data);
    setStep("confirm");
  }

  async function submitSignature() {
    if (!payload || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const response = await fetch("/api/signatures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: abortRef.current.signal,
      });
      const data = (await response.json().catch(() => null)) as
        | { success: true }
        | { success: false; code?: string }
        | null;

      if (response.ok && data?.success) {
        setStep("success");
        return;
      }

      const code = data && "code" in data ? data.code : "INTERNAL_ERROR";
      setSubmitError(errorMessages[code ?? "INTERNAL_ERROR"] ?? errorMessages.INTERNAL_ERROR);
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        setSubmitError(errorMessages.INTERNAL_ERROR);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (step === "success") {
    return <SuccessState />;
  }

  return (
    <div className="relative w-full overflow-hidden">
      <Image
        alt=""
        aria-hidden="true"
        className="drone-card-float pointer-events-none absolute right-[-16px] top-[-4px] z-0 h-auto w-[138px] opacity-[0.16] drop-shadow-[0_18px_24px_rgba(4,79,69,0.22)] sm:right-[-8px] sm:w-[150px]"
        height={120}
        src="/imagens/drone-3.png"
        width={180}
      />
      <header className="animate-form relative z-10 mb-8">
        <div className="mb-7 flex items-center">
          <Image
            alt="Brasmaquinas"
            className="h-auto w-[54px]"
            height={64}
            priority
            src="/imagens/logo-brasmaquinas.png"
            width={64}
          />
        </div>
        <h1 className="text-[32px] font-semibold leading-tight tracking-tight text-neutral-950">
          Registre seu apoio
        </h1>
        <p className="mt-3 text-[16px] leading-7 text-neutral-600">
          Preencha seus dados abaixo para registrar sua participacao. Leva menos de 1 minuto.
        </p>
        <ol className="mt-6 flex items-center gap-2 text-xs font-medium text-neutral-400">
          {["Dados", "Confirmar", "Concluido"].map((item, index) => (
            <li
              className={index === (step === "form" ? 0 : 1) ? "text-[#17664f]" : ""}
              key={item}
            >
              {item}
              {index < 2 ? <span className="mx-2 text-neutral-300">/</span> : null}
            </li>
          ))}
        </ol>
      </header>

      {step === "form" ? (
        <form
          className="animate-form relative z-10"
          noValidate
          onSubmit={handleSubmit(moveToConfirm)}
        >
          <div className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-neutral-900" htmlFor="name">
                Nome completo
              </label>
              <input
                {...nameField}
                ref={(element) => {
                  registerNameRef(element);
                  nameRef.current = element;
                }}
                aria-describedby={errors.name ? "name-error" : undefined}
                aria-invalid={Boolean(errors.name)}
                autoComplete="name"
                className="mt-2 h-14 w-full rounded-2xl border border-neutral-200 bg-white px-4 text-[16px] text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-[#17664f] focus:ring-4 focus:ring-[#17664f]/10"
                id="name"
                placeholder="Digite seu nome completo"
                type="text"
              />
              {errors.name ? (
                <p className="mt-2 text-sm font-medium text-red-600" id="name-error">
                  {errors.name.message}
                </p>
              ) : null}
            </div>

            <div>
              <label className="text-sm font-semibold text-neutral-900" htmlFor="cpf">
                CPF
              </label>
              <CpfInput
                aria-describedby={errors.cpf ? "cpf-error" : undefined}
                aria-invalid={Boolean(errors.cpf)}
                className="mt-2 h-14 w-full rounded-2xl border border-neutral-200 bg-white px-4 text-[16px] text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-[#17664f] focus:ring-4 focus:ring-[#17664f]/10"
                id="cpf"
                onChange={(value) =>
                  setValue("cpf", formatCpf(value), { shouldDirty: true, shouldValidate: true })
                }
                placeholder="000.000.000-00"
                value={cpf}
              />
              {errors.cpf ? (
                <p className="mt-2 text-sm font-medium text-red-600" id="cpf-error">
                  {errors.cpf.message}
                </p>
              ) : null}
            </div>
          </div>

          {submitError ? (
            <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-700">
              {submitError}
            </p>
          ) : null}

          <div className="mt-7">
            <Button disabled={!isValid} type="submit">
              Registrar meu apoio
            </Button>
          </div>

          <p className="mt-5 text-center text-xs leading-5 text-neutral-500">
            Ao enviar, voce concorda com o uso destes dados exclusivamente para o registro
            desta participacao.{" "}
            <Link className="font-semibold text-[#17664f] underline-offset-4 hover:underline" href="/privacidade">
              Politica de Privacidade
            </Link>
          </p>
        </form>
      ) : payload ? (
        <div className="relative z-10">
          {submitError ? (
            <p className="mb-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-700">
              {submitError}
            </p>
          ) : null}
          <ConfirmationStep
            cpf={payload.cpf}
            isSubmitting={isSubmitting}
            name={payload.name}
            onBack={() => setStep("form")}
            onConfirm={submitSignature}
          />
        </div>
      ) : null}
    </div>
  );
}
