"use client";

import type { InputHTMLAttributes } from "react";
import { formatCpf } from "@/lib/cpf";

type CpfInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  onChange: (value: string) => void;
};

export function CpfInput({ onChange, value, ...props }: CpfInputProps) {
  return (
    <input
      {...props}
      value={typeof value === "string" ? formatCpf(value) : ""}
      inputMode="numeric"
      autoComplete="off"
      maxLength={14}
      onChange={(event) => onChange(formatCpf(event.target.value))}
    />
  );
}
