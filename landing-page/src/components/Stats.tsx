import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 1500, suffix: "+", label: "Colaboradores Atendidos" },
  { value: 2, suffix: "", label: "Técnicos de TI" },
  { value: 3, suffix: "s", label: "Triagem pela IA" },
  { value: 75, suffix: "%", label: "Resolução Automática" },
  { value: 15, suffix: "min", label: "Sync com RH" },
];

function AnimatedCounter({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let rafId: number;
    let mounted = true;
    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      if (!mounted) return;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      mounted = false;
      cancelAnimationFrame(rafId);
    };
  }, [inView, value]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        onEnter: () => setInView(true),
      });

      gsap.fromTo(
        ".stat-divider",
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );

      const statItems = sectionRef.current?.querySelectorAll(".stat-item");
      if (statItems) {
        gsap.fromTo(
          statItems,
          { y: 60, opacity: 0, scale: 0.8 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
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
      id="stats"
      ref={sectionRef}
      className="relative py-32 md:py-40 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#2B3891]/[0.08] via-[#0A060D] to-[#E32085]/[0.08]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#582676]/[0.05] rounded-full blur-[150px] parallax-layer" data-speed="0.3" />

      <div className="absolute inset-0 border-y border-white/[0.04]" />

      <div className="container relative z-10 mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-[#E32085] mb-6">
            Números Reais
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold">
            O impacto do
            <br />
            <span className="text-shimmer">O.R.I em dados</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-0">
          {stats.map((stat, index) => (
            <div key={stat.label} className="stat-item relative flex flex-col items-center text-center">
              {index > 0 && (
                <div className="stat-divider hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-20 bg-gradient-to-b from-transparent via-white/10 to-transparent origin-center" />
              )}
              <div data-testid={`stat-${index}`}>
                <span className="block text-5xl md:text-7xl font-display font-bold bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent mb-3">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} inView={inView} />
                </span>
                <span className="text-sm md:text-base text-white/40 uppercase tracking-widest font-medium">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
