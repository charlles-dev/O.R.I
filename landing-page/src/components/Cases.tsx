import { useEffect, useRef, useCallback, type MouseEvent } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stackItems = [
  {
    name: "Zoho Cliq",
    role: "Canal de Comunicação",
    description:
      "Plataforma de mensagens corporativas onde o bot O.R.I atende os colaboradores em tempo real.",
    gradient: "from-[#2B3891] to-[#5255CA]",
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
        <rect x="4" y="8" width="32" height="24" rx="4" stroke="currentColor" strokeWidth="2" />
        <path d="M12 18H28M12 24H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Next.js 14",
    role: "Painel Web",
    description:
      "Framework React para o painel administrativo de TI com Server Components e App Router.",
    gradient: "from-[#E32085] to-[#C345B2]",
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
        <rect x="4" y="4" width="32" height="32" rx="4" stroke="currentColor" strokeWidth="2" />
        <path d="M14 28V12L28 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M28 12V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Vercel Serverless",
    role: "Hospedagem e API",
    description:
      "Infraestrutura serverless com deploy automático, edge functions e escalabilidade sob demanda.",
    gradient: "from-[#582676] to-[#E32085]",
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
        <path d="M20 6L36 34H4L20 6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "Supabase + pgvector",
    role: "Banco de Dados e Busca Vetorial",
    description:
      "PostgreSQL gerenciado com extensão pgvector para armazenamento de embeddings e busca semântica na KB.",
    gradient: "from-[#64F4F5] to-[#2B3891]",
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
        <ellipse cx="20" cy="12" rx="14" ry="6" stroke="currentColor" strokeWidth="2" />
        <path d="M6 12V28C6 31.3 12.3 34 20 34S34 31.3 34 28V12" stroke="currentColor" strokeWidth="2" />
        <path d="M6 20C6 23.3 12.3 26 20 26S34 23.3 34 20" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    name: "Google Gemini 2.5 Flash",
    role: "Motor de IA",
    description:
      "Modelo generativo de alta velocidade para triagem de chamados, classificação e geração de respostas contextuais.",
    gradient: "from-[#2B3891] to-[#E32085]",
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
        <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="2" />
        <path d="M20 10V20L27 27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.5" />
      </svg>
    ),
  },
  {
    name: "GLPI",
    role: "Gestão de Chamados",
    description:
      "Sistema ITSM para controle do ciclo de vida dos chamados de suporte, integrado ao bot e ao painel.",
    gradient: "from-[#E32085] to-[#582676]",
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
        <rect x="6" y="6" width="28" height="28" rx="4" stroke="currentColor" strokeWidth="2" />
        <path d="M12 14H28M12 20H28M12 26H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="26" cy="26" r="3" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
];

function TiltStackCard({ children, className, testId }: { children: React.ReactNode; className?: string; testId?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale3d(1.04, 1.04, 1.04)`;
    ref.current.style.transition = 'transform 0.1s ease-out';
    if (glareRef.current) {
      const gx = (e.clientX - rect.left) / rect.width * 100;
      const gy = (e.clientY - rect.top) / rect.height * 100;
      glareRef.current.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.06), transparent 60%)`;
    }
  }, []);

  const handleLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
    ref.current.style.transition = 'transform 0.5s ease-out';
    if (glareRef.current) {
      glareRef.current.style.background = 'transparent';
    }
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      data-testid={testId}
    >
      <div
        ref={glareRef}
        className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
      />
      {children}
    </div>
  );
}

export default function Stack() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".stack-title",
        { y: 60, opacity: 0, filter: "blur(8px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      const cards = sectionRef.current?.querySelectorAll(".stack-card");
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0, scale: 0.85, filter: "blur(6px)" },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.9,
            stagger: 0.12,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: cards[0],
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="stack"
      ref={sectionRef}
      className="relative py-32 md:py-40 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A060D] via-[#0D0815] to-[#0A060D]" />

      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#2B3891]/[0.03] rounded-full blur-[150px] parallax-layer" data-speed="0.3" />

      <div className="container relative z-10 mx-auto px-6 md:px-12">
        <div className="text-center mb-20 stack-title">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-[#E32085] mb-6">
            Arquitetura
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold">
            Stack
            <br />
            <span className="text-shimmer">tecnológica</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stackItems.map((item, index) => (
            <TiltStackCard
              key={item.name}
              className="stack-card group relative p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-white/[0.12] transition-all duration-500 overflow-hidden"
              testId={`card-stack-${index}`}
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.gradient} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500`} />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#E32085]">
                    {item.role}
                  </span>
                </div>

                <div className="mb-4 text-white/40 group-hover:text-white/70 transition-colors">
                  {item.icon}
                </div>

                <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-3 group-hover:text-white transition-colors">
                  {item.name}
                </h3>

                <p className="text-white/40 leading-relaxed text-sm group-hover:text-white/60 transition-colors">
                  {item.description}
                </p>
              </div>
            </TiltStackCard>
          ))}
        </div>
      </div>
    </section>
  );
}
