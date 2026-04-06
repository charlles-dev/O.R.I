import { useEffect, useRef, useCallback, type MouseEvent } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    number: "01",
    title: "Triagem Inteligente com IA",
    description:
      "O Gemini 2.5 Flash analisa a solicitação do colaborador, classifica a urgência e direciona automaticamente para a fila correta em 1 a 3 segundos.",
    tags: ["Gemini 2.5 Flash", "Classificação", "Automação"],
    gradient: "from-[#2B3891] to-[#5255CA]",
  },
  {
    number: "02",
    title: "Busca Semântica na Knowledge Base",
    description:
      "Pesquisa vetorial com Supabase pgvector na base de conhecimento interna. Encontra soluções e procedimentos relevantes mesmo com descrições imprecisas.",
    tags: ["pgvector", "Embeddings", "Supabase"],
    gradient: "from-[#E32085] to-[#C345B2]",
  },
  {
    number: "03",
    title: "Onboarding e Offboarding Automático",
    description:
      "Sincronização com o RH a cada 15 minutos. Criação e remoção automática de contas, acessos e equipamentos para novos colaboradores e desligamentos.",
    tags: ["Sync RH", "Provisionamento", "Automação"],
    gradient: "from-[#582676] to-[#2B3891]",
  },
  {
    number: "04",
    title: "Central de Tarefas Manuais",
    description:
      "Gestão unificada de tarefas que exigem ação humana: Carbonio, Zentyal, iNControl e Topdata. Fila organizada com priorização inteligente.",
    tags: ["Carbonio", "Zentyal", "Topdata"],
    gradient: "from-[#64F4F5] to-[#2B3891]",
  },
  {
    number: "05",
    title: "Gestão de Chamados GLPI",
    description:
      "Integração completa com o GLPI para abertura, acompanhamento e resolução de chamados técnicos. Visibilidade total do ciclo de vida do ticket.",
    tags: ["GLPI", "Chamados", "SLA"],
    gradient: "from-[#2B3891] to-[#E32085]",
  },
  {
    number: "06",
    title: "Cadastro de Ativos e Crachás RFID",
    description:
      "Registro e controle de equipamentos, dispositivos e crachás RFID dos colaboradores. Rastreabilidade completa do inventário de TI.",
    tags: ["Ativos", "RFID", "Inventário"],
    gradient: "from-[#E32085] to-[#582676]",
  },
];

function TiltServiceCard({ children, className, testId }: { children: React.ReactNode; className?: string; testId?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 6}deg) translateX(${x * 10}px)`;
    ref.current.style.transition = 'transform 0.1s ease-out';
    if (glareRef.current) {
      const gx = (e.clientX - rect.left) / rect.width * 100;
      const gy = (e.clientY - rect.top) / rect.height * 100;
      glareRef.current.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.08), transparent 60%)`;
    }
  }, []);

  const handleLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateX(0px)';
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

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = sectionRef.current?.querySelectorAll(".service-item");
      if (items) {
        items.forEach((item, i) => {
          gsap.fromTo(
            item,
            { x: i % 2 === 0 ? -80 : 80, opacity: 0, filter: "blur(6px)" },
            {
              x: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: item,
                start: "top 88%",
                toggleActions: "play none none none",
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative py-32 md:py-40 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A060D] via-[#100A18] to-[#0A060D]" />

      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#E32085]/[0.03] rounded-full blur-[120px] parallax-layer" data-speed="0.4" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-[#2B3891]/[0.04] rounded-full blur-[100px] parallax-layer" data-speed="0.2" />

      <div className="container relative z-10 mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-20">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-[#E32085] mb-6"
            >
              Funcionalidades
            </motion.span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight">
              O que o O.R.I
              <br />
              <span className="text-shimmer">faz por você</span>
            </h2>
          </div>
          <p className="mt-6 md:mt-0 max-w-md text-white/50 text-lg leading-relaxed">
            Cada funcionalidade foi projetada para eliminar trabalho repetitivo
            e dar velocidade ao suporte de TI.
          </p>
        </div>

        <div className="space-y-4">
          {services.map((service, index) => (
            <TiltServiceCard
              key={service.number}
              className="service-item group relative p-8 md:p-10 rounded-2xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-500 cursor-pointer overflow-hidden"
              testId={`card-service-${index}`}
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500`} />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                <span className="text-5xl md:text-6xl font-display font-bold text-white/[0.06] group-hover:text-white/[0.12] transition-colors shrink-0">
                  {service.number}
                </span>

                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-white/90 group-hover:text-white transition-colors mb-3">
                    {service.title}
                  </h3>
                  <p className="text-white/40 group-hover:text-white/60 transition-colors max-w-xl leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 md:justify-end shrink-0">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-medium uppercase tracking-wider rounded-full border border-white/[0.08] text-white/40 group-hover:text-white/70 group-hover:border-white/[0.15] transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full border border-white/[0.08] group-hover:border-[#E32085]/50 group-hover:bg-[#E32085]/10 transition-all shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white/30 group-hover:text-[#E32085] transition-colors"
                    />
                  </svg>
                </div>
              </div>
            </TiltServiceCard>
          ))}
        </div>
      </div>
    </section>
  );
}
