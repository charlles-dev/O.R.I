import { useEffect } from "react";
import { motion } from "framer-motion";
import { Stats } from "@/components/Stats";
import { ChatDemo } from "@/components/ChatDemo";
import { Features } from "@/components/Features";
import { Integrations } from "@/components/Integrations";
import { Workflow } from "@/components/Workflow";
import { Impact } from "@/components/Impact";
import { Cta } from "@/components/Cta";
import { ArrowRight, Code, Database, Globe, Network, Server, Terminal } from "lucide-react";

export function Home() {
  useEffect(() => {
    // Add dark class to html to force dark mode globally
    document.documentElement.classList.add("dark");
    return () => document.documentElement.classList.remove("dark");
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-white">
      {/* Noise Texture Overlay */}
      <div className="fixed inset-0 z-50 bg-noise pointer-events-none mix-blend-overlay"></div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 border-b border-border/50 bg-background/50 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/ori-logo-main.png" alt="O.R.I Logo" className="h-8 w-auto object-contain drop-shadow-[0_0_8px_rgba(227,32,133,0.5)]" />
            <span className="font-display text-xl tracking-wider text-glow">O.R.I</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Capacidades</a>
            <a href="#demo" className="hover:text-foreground transition-colors">Simulação</a>
            <a href="#workflow" className="hover:text-foreground transition-colors">Fluxo</a>
            <a href="#architecture" className="hover:text-foreground transition-colors">Arquitetura</a>
          </div>
          <button className="px-5 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-sm font-bold flex items-center gap-2">
            Acesso Interno
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Cinematic background effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/10 text-accent mb-8 backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span className="text-xs font-bold tracking-widest uppercase">Sistema Operacional Online</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-display leading-[1.1] mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60"
            >
              O Cérebro da <br />
              <span className="text-glow-primary text-primary">Proxxima</span> TI
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Operações, Recursos e Inteligência. Uma arquitetura autônoma alimentada por IA que resolve chamados, gerencia acessos e orquestra a infraestrutura de 1.500 colaboradores silenciosamente.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <a href="#demo" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all duration-300 hover:shadow-[0_0_30px_rgba(43,56,140,0.5)] flex items-center justify-center gap-2 group">
                <Terminal className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                Iniciar Simulação
              </a>
              <a href="#features" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-card border border-border text-foreground font-bold hover:bg-card/80 transition-all duration-300 flex items-center justify-center gap-2">
                Explorar Arquitetura
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <Stats />

      {/* Workflow Section */}
      <div id="workflow">
        <Workflow />
      </div>

      {/* Chat Demo Section */}
      <section id="demo" className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl mb-4 text-glow">Interface de Comando</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Interaja com o O.R.I como um colaborador da Proxxima. Experimente a latência quase nula e o entendimento contextual avançado.</p>
          </div>
          
          <ChatDemo />
        </div>
      </section>

      {/* Features Section */}
      <div id="features">
        <Features />
      </div>

      {/* Integrations Section */}
      <Integrations />

      {/* Impact Section */}
      <Impact />

      {/* Architecture Section */}
      <section id="architecture" className="py-32 bg-secondary/20 border-y border-border relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(43,56,140,0.15)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-4xl md:text-5xl mb-6 text-glow">Stack Tecnológico <br/>de Alta Performance</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Construído para resiliência e velocidade. O.R.I opera em uma arquitetura serverless moderna, garantindo tempo de atividade de 99.9% mesmo durante picos de solicitações.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="mt-1 bg-card border border-border p-3 rounded-lg"><Code className="h-6 w-6 text-primary" /></div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Frontend App</h4>
                    <p className="text-muted-foreground text-sm">Next.js 14 App Router, React, TailwindCSS. Interface administrativa de baixíssima latência para os técnicos de TI.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 bg-card border border-border p-3 rounded-lg"><Database className="h-6 w-6 text-accent" /></div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Database & Auth</h4>
                    <p className="text-muted-foreground text-sm">Supabase (PostgreSQL). Segurança robusta com RLS, gerando embeddings de vetores com pgvector para busca semântica.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 bg-card border border-border p-3 rounded-lg"><Server className="h-6 w-6 text-blue-400" /></div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">AI Engine</h4>
                    <p className="text-muted-foreground text-sm">Google Gemini 2.5 Flash via SDK. Processamento de linguagem natural otimizado para tarefas operacionais rápidas.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative h-[500px] w-full bg-card/50 rounded-2xl border border-border overflow-hidden p-8 flex items-center justify-center">
              {/* Abstract Architecture Diagram */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_14px]"></div>
              
              <div className="relative z-10 w-full max-w-sm">
                <div className="flex flex-col gap-8">
                  {/* Top Layer */}
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex-1 bg-background border border-border p-4 rounded-xl text-center shadow-lg relative group">
                      <Globe className="h-6 w-6 mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-xs font-bold">Zoho Cliq</span>
                    </div>
                    <div className="flex-1 bg-background border border-border p-4 rounded-xl text-center shadow-lg relative group">
                      <Terminal className="h-6 w-6 mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-xs font-bold">Web Admin</span>
                    </div>
                  </div>
                  
                  {/* Middle Layer */}
                  <div className="bg-primary/20 border border-primary p-6 rounded-xl text-center relative shadow-[0_0_30px_rgba(43,56,140,0.3)] backdrop-blur-md">
                    <img src="/images/ori-logo-main.png" alt="O.R.I Logo" className="h-12 mx-auto mb-2 opacity-90 drop-shadow-xl" />
                    <span className="font-display tracking-widest text-primary-foreground">O.R.I CORE</span>
                    
                    {/* Connecting lines */}
                    <div className="absolute -top-8 left-1/4 w-0.5 h-8 bg-gradient-to-b from-border to-primary"></div>
                    <div className="absolute -top-8 right-1/4 w-0.5 h-8 bg-gradient-to-b from-border to-primary"></div>
                    <div className="absolute -bottom-8 left-1/4 w-0.5 h-8 bg-gradient-to-t from-border to-primary"></div>
                    <div className="absolute -bottom-8 right-1/4 w-0.5 h-8 bg-gradient-to-t from-border to-primary"></div>
                  </div>
                  
                  {/* Bottom Layer */}
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex-1 bg-background border border-border p-4 rounded-xl text-center shadow-lg group">
                      <Database className="h-6 w-6 mx-auto mb-2 text-muted-foreground group-hover:text-accent transition-colors" />
                      <span className="text-xs font-bold">Supabase</span>
                    </div>
                    <div className="flex-1 bg-background border border-border p-4 rounded-xl text-center shadow-lg group">
                      <Network className="h-6 w-6 mx-auto mb-2 text-muted-foreground group-hover:text-accent transition-colors" />
                      <span className="text-xs font-bold">Sistemas (GLPI/AD)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <Cta />

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src="/images/ori-logo-main.png" alt="O.R.I Logo" className="h-6 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" />
              <span className="font-display text-lg text-muted-foreground">O.R.I</span>
            </div>
            
            <p className="text-sm text-muted-foreground text-center md:text-left">
              &copy; {new Date().getFullYear()} Proxxima Telecom. Uso interno restrito.
            </p>
            
            <div className="flex gap-4">
              <span className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground font-mono">v3.2.0</span>
              <span className="flex items-center gap-1.5 text-xs px-2 py-1 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Sistemas Operacionais
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}