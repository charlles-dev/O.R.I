import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const oriLogo = `${import.meta.env.BASE_URL}ori-logo.png`;

const sectionColors: Record<string, string> = {
  hero: "rgba(10,6,13,0.6)",
  about: "rgba(43,56,145,0.12)",
  services: "rgba(227,32,133,0.10)",
  stats: "rgba(88,38,118,0.12)",
  stack: "rgba(43,56,145,0.10)",
  cta: "rgba(227,32,133,0.12)",
};

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = ["hero", "about", "services", "stats", "stack", "cta"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const navItems = [
    { label: "O Sistema", href: "#about" },
    { label: "Funcionalidades", href: "#services" },
    { label: "Números", href: "#stats" },
    { label: "Stack", href: "#stack" },
  ];

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const bgColor = scrolled ? sectionColors[activeSection] || sectionColors.hero : "transparent";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3 backdrop-blur-xl border-b border-white/[0.04]" : "bg-transparent py-6"
      }`}
      style={{
        backgroundColor: bgColor,
      }}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <a 
          href="#hero" 
          onClick={(e) => scrollTo(e, "#hero")}
          className="relative z-50 flex items-center gap-2"
          data-testid="link-home"
        >
          <img src={oriLogo} alt="O.R.I Logo" className="h-8 md:h-10 object-contain" />
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.replace("#", "");
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => scrollTo(e, item.href)}
                className={`text-sm font-medium tracking-wide transition-colors uppercase ${
                  isActive ? "text-[#E32085]" : "text-white/70 hover:text-white"
                }`}
                data-testid={`link-${item.href.replace('#', '')}`}
              >
                {item.label}
              </a>
            );
          })}
          <a
            href="#cta"
            onClick={(e) => scrollTo(e, "#cta")}
            className="glowing-border px-6 py-2.5 text-sm font-bold uppercase tracking-wider transition-transform hover:scale-105"
            data-testid="btn-contact-header"
          >
            Acessar Painel
          </a>
        </nav>

        <button
          className="md:hidden relative z-50 text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav"
          data-testid="btn-mobile-menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#0A060D]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8"
            role="navigation"
            aria-label="Menu principal"
          >
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => scrollTo(e, item.href)}
                className="text-2xl font-display uppercase tracking-widest text-white hover:text-[#E32085] transition-colors"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#cta"
              onClick={(e) => scrollTo(e, "#cta")}
              className="glowing-border px-8 py-4 mt-4 text-lg font-bold uppercase tracking-wider"
            >
              Acessar Painel
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
