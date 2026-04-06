import { useEffect, useRef, useCallback, type MouseEvent } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function TiltCard({ children, className, testId }: { children: React.ReactNode; className?: string; testId?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale3d(1.03, 1.03, 1.03)`;
    cardRef.current.style.transition = 'transform 0.1s ease-out';
  }, []);

  const handleLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
    cardRef.current.style.transition = 'transform 0.4s ease-out';
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      data-testid={testId}
    >
      {children}
    </div>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: 80, opacity: 0, filter: "blur(10px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      const cards = cardsRef.current?.querySelectorAll(".vision-card");
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 80, opacity: 0, scale: 0.9, filter: "blur(8px)" },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 1,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const pillars = [
    {
      title: "Bot Conversacional",
      description:
        "Integrado ao Zoho Cliq, o bot é o ponto de contato dos colaboradores com o suporte de TI. Triagem automática, abertura de chamados e consultas — tudo via chat.",
      icon: (
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
          <rect x="6" y="10" width="36" height="24" rx="4" stroke="#E32085" strokeWidth="2" opacity="0.3" />
          <path d="M16 22H32M16 28H26" stroke="#E32085" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="12" cy="22" r="2" fill="#E32085" />
        </svg>
      ),
    },
    {
      title: "Painel Web TI",
      description:
        "Aplicação web em Next.js hospedada na Vercel. Central de gestão de chamados GLPI, ativos, crachás RFID, tarefas manuais e onboarding/offboarding de colaboradores.",
      icon: (
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
          <rect x="8" y="8" width="32" height="32" rx="4" stroke="#2B3891" strokeWidth="2" opacity="0.3" />
          <rect x="12" y="12" width="24" height="6" rx="2" stroke="#2B3891" strokeWidth="2.5" />
          <rect x="12" y="22" width="10" height="14" rx="2" stroke="#2B3891" strokeWidth="2" opacity="0.6" />
          <rect x="26" y="22" width="10" height="14" rx="2" stroke="#2B3891" strokeWidth="2" opacity="0.6" />
        </svg>
      ),
    },
    {
      title: "Módulo de IA",
      description:
        "Google Gemini 2.5 Flash com busca semântica via Supabase pgvector. Classifica chamados, sugere soluções da Knowledge Base e realiza triagem em segundos.",
      icon: (
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
          <polygon points="24,6 42,42 6,42" stroke="#64F4F5" strokeWidth="2" opacity="0.3" />
          <circle cx="24" cy="28" r="6" stroke="#64F4F5" strokeWidth="2.5" />
          <path d="M24 22V18" stroke="#64F4F5" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-32 md:py-40 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A060D] via-[#0D0815] to-[#0A060D]" />
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-[#2B3891]/[0.04] rounded-full blur-[150px] parallax-layer" data-speed="0.3" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-[#E32085]/[0.03] rounded-full blur-[120px] parallax-layer" data-speed="0.5" />

      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#2B3891]/30 to-transparent" />

      <div className="container relative z-10 mx-auto px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-[#E32085] mb-6"
          >
            O Sistema
          </motion.span>
          <h2
            ref={titleRef}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-8"
          >
            Três pilares,
            <br />
            <span className="text-shimmer">uma plataforma</span>
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed"
          >
            O O.R.I — Operações, Recursos e Inteligência — é a plataforma
            interna de TI da Proxxima Telecom. Bot, painel e IA trabalhando
            juntos para atender 1.500+ colaboradores com apenas 2 técnicos.
          </motion.p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {pillars.map((pillar, index) => (
            <TiltCard
              key={pillar.title}
              className="vision-card group relative p-8 md:p-10 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-white/[0.12] transition-colors duration-500"
              testId={`card-pillar-${index}`}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#2B3891]/5 to-[#E32085]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="mb-6">{pillar.icon}</div>
                <h3 className="text-xl md:text-2xl font-display font-bold mb-4 text-white/90 group-hover:text-white transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-white/50 leading-relaxed group-hover:text-white/70 transition-colors">
                  {pillar.description}
                </p>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
