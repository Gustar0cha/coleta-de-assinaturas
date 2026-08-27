import { Check } from "lucide-react";

export function SuccessState() {
  return (
    <section className="animate-success flex min-h-[430px] flex-col items-center justify-center text-center">
      <div className="grid size-20 place-items-center rounded-full bg-[#17664f]/10 text-[#17664f]">
        <div className="grid size-14 animate-[pop_260ms_ease-out] place-items-center rounded-full bg-[#17664f] text-white">
          <Check aria-hidden="true" className="size-8" strokeWidth={3} />
        </div>
      </div>
      <h1 className="mt-7 text-3xl font-semibold tracking-tight text-neutral-950">
        Apoio registrado!
      </h1>
      <p className="mt-3 max-w-[280px] text-balance text-[16px] leading-7 text-neutral-600">
        Obrigado pela sua participacao. Seu registro foi recebido com sucesso.
      </p>
    </section>
  );
}
