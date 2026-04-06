import { Component, useEffect, useRef, useState, Suspense, lazy, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

const LazyPrismCanvas = lazy(() => import('./PrismCanvas'));

function detectWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext('webgl') || c.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

class WebGLErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function AuroraFallback() {
  return (
    <div className="w-full h-full relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#2B3891]/40 via-[#0A060D] to-[#E32085]/20 animate-pulse" />
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-[#2B3891]/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/3 right-1/4 w-[250px] h-[250px] bg-[#E32085]/15 rounded-full blur-[80px]" />
    </div>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const [hasWebGL, setHasWebGL] = useState(false);

  useEffect(() => {
    setHasWebGL(detectWebGL());
  }, []);

  useEffect(() => {
    if (!titleRef.current) return;

    const chars = titleRef.current.querySelectorAll('.char');
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(
        chars,
        { y: 100, opacity: 0, rotateX: -90 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.2,
          stagger: 0.05,
          ease: 'power4.out',
          delay: 0.2,
        }
      ).fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
        '-=0.8'
      );
    });

    return () => ctx.revert();
  }, []);

  const splitText = (text: string) => {
    return text.split('').map((char, index) => (
      <span
        key={index}
        className="char inline-block"
        style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
      >
        {char}
      </span>
    ));
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-20"
    >
      <div className="absolute inset-0 z-0">
        {hasWebGL ? (
          <WebGLErrorBoundary fallback={<AuroraFallback />}>
            <Suspense fallback={<AuroraFallback />}>
              <LazyPrismCanvas />
            </Suspense>
          </WebGLErrorBoundary>
        ) : (
          <AuroraFallback />
        )}
      </div>

      <div className="container relative z-10 mx-auto px-6 md:px-12 text-center pointer-events-none">
        <h1
          ref={titleRef}
          className="hero-title text-5xl md:text-7xl lg:text-9xl font-display font-bold uppercase tracking-tight leading-none mb-6"
        >
          {splitText('Inteligência')}
          <br />
          <span className="hero-title-accent pointer-events-auto cursor-default">
            {splitText('Operacional')}
          </span>
        </h1>

        <motion.p
          ref={subtitleRef}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 1.2 }}
          className="hero-tagline max-w-2xl mx-auto text-lg md:text-2xl text-white/80 font-light tracking-wide mb-12"
        >
          Automação de suporte de TI com bot conversacional, painel administrativo
          e IA generativa — atendendo 1.500+ colaboradores da Proxxima Telecom.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 1.6 }}
          className="pointer-events-auto flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <motion.a
            href="#about"
            whileHover={{ scale: 1.03, y: -3 }}
            whileTap={{ scale: 0.97 }}
            className="glass-hero-btn"
            data-testid="btn-discover"
          >
            <span className="glass-hero-shimmer" />
            <span className="relative z-10 text-sm font-bold uppercase tracking-widest text-white">
              Conhecer o Sistema
            </span>
          </motion.a>

          <motion.a
            href="#cta"
            whileHover={{ scale: 1.03, y: -3 }}
            whileTap={{ scale: 0.97 }}
            className="glass-hero-btn"
            data-testid="btn-access"
          >
            <span className="glass-hero-shimmer" />
            <span className="relative z-10 text-sm font-bold uppercase tracking-widest text-white">
              Acessar Painel
            </span>
          </motion.a>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-24 bg-gradient-to-b from-white/20 to-transparent" />
    </section>
  );
}
