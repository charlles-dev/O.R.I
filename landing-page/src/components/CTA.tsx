import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Meteor({ delay, left, duration }: { delay: number; left: string; duration: number }) {
  return (
    <div
      className="absolute w-[1px] h-20 rotate-[215deg] opacity-0"
      style={{
        left,
        top: "-20px",
        animation: `meteor ${duration}s linear ${delay}s infinite`,
      }}
    >
      <div className="w-full h-full bg-gradient-to-b from-[#E32085] via-[#E32085]/40 to-transparent" />
    </div>
  );
}

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cta-content",
        { y: 80, opacity: 0, scale: 0.9, filter: "blur(10px)" },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="relative py-32 md:py-48 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A060D] via-[#150A20] to-[#0A060D]" />

      <div className="absolute inset-0 overflow-hidden">
        <Meteor delay={0} left="10%" duration={3} />
        <Meteor delay={1.2} left="30%" duration={2.5} />
        <Meteor delay={2.5} left="55%" duration={3.5} />
        <Meteor delay={0.8} left="75%" duration={2.8} />
        <Meteor delay={3} left="90%" duration={3.2} />
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E32085]/[0.06] rounded-full blur-[200px] parallax-layer" data-speed="0.4" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#2B3891]/[0.08] rounded-full blur-[150px] parallax-layer" data-speed="0.2" />

      <div className="container relative z-10 mx-auto px-6 md:px-12">
        <div className="cta-content max-w-4xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-[#E32085] mb-8"
          >
            Comece Agora
          </motion.span>

          <h2 className="text-4xl md:text-6xl lg:text-8xl font-display font-bold leading-tight mb-8">
            Suporte de TI
            <br />
            <span className="text-shimmer">na palma da mão</span>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Acesse o painel administrativo ou abra um chamado diretamente pelo
            bot no Zoho Cliq.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <a
              href="#"
              className="glowing-border px-10 py-4 text-lg font-bold uppercase tracking-wider transition-transform hover:scale-105"
              data-testid="btn-contact-cta"
            >
              Acessar o Painel TI
            </a>
            <a
              href="#"
              className="group flex items-center gap-3 px-8 py-4 text-white/60 hover:text-white transition-colors"
              data-testid="btn-bot-cta"
            >
              <div className="w-10 h-10 rounded-full border border-white/10 group-hover:border-[#2B3891]/50 flex items-center justify-center transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white/40 group-hover:text-[#2B3891] transition-colors">
                  <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="2" />
                  <path d="M8 12H16M8 16H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="7" cy="12" r="1" fill="currentColor" />
                </svg>
              </div>
              <span className="font-medium text-sm uppercase tracking-wider">Falar com o Bot no Cliq</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
