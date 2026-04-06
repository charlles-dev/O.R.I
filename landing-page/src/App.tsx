import { useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Preloader from "./components/Preloader";
import CustomCursor from "./components/CustomCursor";
import ScrollToTop from "./components/ScrollToTop";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Stats from "./components/Stats";
import Stack from "./components/Cases";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [loaded, setLoaded] = useState(false);

  const handlePreloaderComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;

    ScrollTrigger.refresh();

    const parallaxLayers = document.querySelectorAll<HTMLElement>(".parallax-layer");
    const ctx = gsap.context(() => {
      parallaxLayers.forEach((layer) => {
        const speed = parseFloat(layer.dataset.speed || "0.3");
        gsap.to(layer, {
          yPercent: speed * 100,
          ease: "none",
          scrollTrigger: {
            trigger: layer.closest("section"),
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });
    });

    return () => {
      ctx.revert();
      ScrollTrigger.killAll();
    };
  }, [loaded]);

  return (
    <>
      {!loaded && <Preloader onComplete={handlePreloaderComplete} />}
      <CustomCursor />
      <div className={`relative min-h-screen w-full bg-[#0A060D] text-white selection:bg-[#E32085] selection:text-white ${loaded ? 'animate-fadeIn' : 'opacity-0'}`}>
        <div className="noise-overlay"></div>
        <Header />
        <main className="flex flex-col w-full relative z-10">
          <Hero />
          <About />
          <Services />
          <Stats />
          <Stack />
          <CTA />
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
}

export default App;
