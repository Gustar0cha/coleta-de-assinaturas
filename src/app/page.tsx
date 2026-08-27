import { SignatureForm } from "@/components/signature-form";

export default function Home() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#042f2a] px-4 pb-[calc(env(safe-area-inset-bottom)+24px)] pt-[calc(env(safe-area-inset-top)+28px)] text-neutral-950">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[url('/imagens/imagem-fundo.png')] bg-cover bg-center opacity-70 saturate-[1.08] sm:opacity-80"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,47,42,0.34),rgba(4,79,69,0.6)_42%,rgba(242,212,61,0.22)_100%)] sm:bg-[linear-gradient(90deg,rgba(247,250,246,0.9),rgba(4,79,69,0.34)_44%,rgba(4,47,42,0.7)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(5,179,61,0.22),transparent_34%),radial-gradient(circle_at_82%_76%,rgba(242,212,61,0.2),transparent_30%)] mix-blend-soft-light"
      />
      <div className="relative mx-auto flex min-h-[calc(100dvh-52px)] w-full max-w-[430px] flex-col justify-center sm:mr-auto sm:ml-[max(24px,calc((100vw-1120px)/2))]">
        <div className="rounded-[28px] border border-white/70 bg-white/96 px-5 py-7 shadow-[0_28px_90px_rgba(4,47,42,0.28)] backdrop-blur-xl sm:px-7">
          <SignatureForm />
        </div>
      </div>
    </main>
  );
}
