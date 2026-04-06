const oriLogo = `${import.meta.env.BASE_URL}ori-logo.png`;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative py-16 overflow-hidden border-t border-white/[0.04]">
      <div className="absolute inset-0 bg-gradient-to-t from-[#2B3891]/[0.06] via-[#0A060D] to-[#0A060D]" />

      <div className="container relative z-10 mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <img src={oriLogo} alt="O.R.I" className="h-8 object-contain" />
            <div className="h-6 w-[1px] bg-white/10" />
            <span className="text-sm text-white/30">
              Operações, Recursos e Inteligência
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-white/30">
              Equipe de Tecnologia da Informação — Proxxima Telecom
            </span>
            <div className="h-4 w-[1px] bg-white/10" />
            <span className="text-xs text-white/20 font-mono">
              v3.0
            </span>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.04] flex flex-col items-center gap-3">
          <p className="text-xs text-white/20 tracking-wider uppercase">
            {year} O.R.I — Plataforma interna de TI — Proxxima Telecom
          </p>
          <p className="text-xs text-white/25">
            made with 🩷 by{" "}
            <a
              href="https://github.com/charlles-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-[#E32085] transition-colors underline underline-offset-2"
            >
              charlles-dev
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
