import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-dvh bg-[#f7f8f5] px-5 pb-[calc(env(safe-area-inset-bottom)+28px)] pt-[calc(env(safe-area-inset-top)+32px)]">
      <article className="mx-auto max-w-[680px] rounded-[28px] border border-black/[0.04] bg-white px-5 py-7 shadow-[0_24px_80px_rgba(16,24,40,0.08)] sm:px-8">
        <Link className="text-sm font-semibold text-[#17664f] underline-offset-4 hover:underline" href="/">
          Voltar
        </Link>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-neutral-950">
          Politica de Privacidade
        </h1>
        <div className="mt-6 space-y-5 text-[16px] leading-7 text-neutral-600">
          <p>
            Coletamos apenas nome completo e CPF para registrar sua participacao nesta
            iniciativa.
          </p>
          <p>
            Esses dados sao usados exclusivamente para identificar o apoio registrado,
            prevenir duplicidades e manter a integridade da lista de participacoes.
          </p>
          <p>
            As informacoes sao armazenadas em uma planilha Google Sheets acessivel apenas
            pelos responsaveis autorizados pela organizacao.
          </p>
          <p>
            Para solicitar remocao, correcao ou informacoes sobre seus dados, entre em
            contato pelo canal oficial informado pela organizacao responsavel pela coleta.
          </p>
        </div>
      </article>
    </main>
  );
}
