import { formatCpf } from "@/lib/cpf";
import { Button } from "@/components/ui/button";

type ConfirmationStepProps = {
  name: string;
  cpf: string;
  isSubmitting: boolean;
  onBack: () => void;
  onConfirm: () => void;
};

export function ConfirmationStep({
  name,
  cpf,
  isSubmitting,
  onBack,
  onConfirm,
}: ConfirmationStepProps) {
  return (
    <section className="animate-form">
      <div className="rounded-[24px] border border-black/[0.06] bg-white p-5 shadow-[0_18px_50px_rgba(16,24,40,0.06)]">
        <p className="text-sm font-medium text-neutral-500">Confira seus dados</p>
        <dl className="mt-5 space-y-4">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-neutral-400">
              Nome
            </dt>
            <dd className="mt-1 text-[17px] font-semibold text-neutral-950">{name}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-neutral-400">
              CPF
            </dt>
            <dd className="mt-1 text-[17px] font-semibold text-neutral-950">
              {formatCpf(cpf)}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 space-y-2">
        <Button disabled={isSubmitting} onClick={onConfirm}>
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Registrando...
            </span>
          ) : (
            "Confirmar"
          )}
        </Button>
        <Button disabled={isSubmitting} onClick={onBack} type="button" variant="ghost">
          Corrigir dados
        </Button>
      </div>
    </section>
  );
}
