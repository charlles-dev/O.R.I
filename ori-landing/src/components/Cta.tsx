import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

export function Cta() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-background pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full max-h-[500px] bg-accent/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <img src="/images/ori-logo-main.png" alt="O.R.I Logo" className="h-16 mx-auto mb-8 drop-shadow-[0_0_15px_rgba(43,56,140,0.8)]" />
          
          <h2 className="font-display text-5xl md:text-7xl mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
            Pronto para <br />o futuro?
          </h2>
          
          <p className="text-xl text-muted-foreground mb-12">
            Acesse o painel de administração ou inicie uma conversa no Zoho Cliq para interagir com o O.R.I agora mesmo.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all duration-300 hover:shadow-[0_0_30px_rgba(43,56,140,0.5)] flex items-center justify-center gap-2 group">
              <Terminal className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              Acessar Admin Console
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}