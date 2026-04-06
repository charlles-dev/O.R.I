import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let raf: number;
    let doneTimeout: ReturnType<typeof setTimeout>;
    let mounted = true;
    let start: number;
    const duration = 2200;

    const animate = (ts: number) => {
      if (!mounted) return;
      if (!start) start = ts;
      const elapsed = ts - start;
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setProgress(Math.floor(eased * 100));

      if (p < 1) {
        raf = requestAnimationFrame(animate);
      } else {
        doneTimeout = setTimeout(() => {
          if (mounted) setDone(true);
        }, 400);
      }
    };

    raf = requestAnimationFrame(animate);
    return () => {
      mounted = false;
      cancelAnimationFrame(raf);
      clearTimeout(doneTimeout);
    };
  }, []);

  useEffect(() => {
    if (!done) return;
    const timer = setTimeout(onComplete, 800);
    return () => clearTimeout(timer);
  }, [done, onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0A060D]"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="w-20 h-20 rounded-full border-2 border-transparent"
                style={{
                  borderTopColor: '#E32085',
                  borderRightColor: '#2B3891',
                }}
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-2 rounded-full border-2 border-transparent"
                style={{
                  borderBottomColor: '#64F4F5',
                  borderLeftColor: '#582676',
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-[#E32085] animate-pulse" />
              </div>
            </div>

            <h2 className="font-display text-2xl font-bold tracking-wider uppercase text-white/90 mb-4">
              O.R.I
            </h2>

            <div className="w-48 h-[2px] bg-white/[0.06] rounded-full overflow-hidden mb-3">
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #2B3891, #E32085, #64F4F5)',
                }}
              />
            </div>

            <span className="text-xs text-white/30 font-mono tracking-widest">
              {progress}%
            </span>
          </motion.div>

          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E32085]/30 to-transparent" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
