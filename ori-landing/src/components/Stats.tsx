import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface StatItemProps {
  end: number;
  label: string;
  suffix?: string;
  prefix?: string;
}

function StatCounter({ end, label, suffix = "", prefix = "" }: StatItemProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let startTimestamp: number;
      const duration = 2000; // 2 seconds

      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // easeOutQuart
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        
        setCount(Math.floor(easeProgress * end));

        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };

      window.requestAnimationFrame(step);
    }
  }, [isInView, end]);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-5xl md:text-7xl font-display text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent mb-4 tracking-tighter"
      >
        {prefix}{count.toLocaleString("pt-BR")}{suffix}
      </motion.div>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-muted-foreground font-medium tracking-wide uppercase text-sm md:text-base"
      >
        {label}
      </motion.p>
    </div>
  );
}

export function Stats() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-secondary/20 border-y border-border/50"></div>
      
      {/* Decorative grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 divide-x divide-border/30">
          <StatCounter end={1500} label="Colaboradores" suffix="+" />
          <StatCounter end={2} label="Técnicos de TI" />
          <StatCounter end={40} label="Resolução por IA" suffix="%+" />
          <StatCounter end={6} label="Integrações" suffix="+" />
          <StatCounter end={99} label="Uptime" prefix="" suffix=",9%" />
        </div>
      </div>
    </section>
  );
}