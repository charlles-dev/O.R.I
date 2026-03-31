import { motion } from "framer-motion";

const integrations = [
  { name: "GLPI", role: "ITSM / Helpdesk", status: "Active", latency: "12ms" },
  { name: "Zoho Cliq", role: "Interface Conversacional", status: "Active", latency: "45ms" },
  { name: "Zentyal AD", role: "Diretório de Usuários", status: "Active", latency: "8ms" },
  { name: "iNControl", role: "Controle de Acesso", status: "Active", latency: "22ms" },
  { name: "API RH", role: "Onboarding/Offboarding", status: "Active", latency: "18ms" },
  { name: "Gemini 2.5", role: "Motor de IA", status: "Active", latency: "150ms" }
];

export function Integrations() {
  return (
    <section className="py-32 relative overflow-hidden bg-background">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl mb-6 text-glow"
          >
            Ecossistema Conectado
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Monitoramento em tempo real do estado de conexão com os principais sistemas operacionais da Proxxima Telecom.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="bg-card/40 border border-border rounded-xl p-6 backdrop-blur-md relative overflow-hidden group hover:border-primary/50 transition-colors"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{integration.name}</h3>
                  <p className="text-sm text-muted-foreground">{integration.role}</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-medium text-emerald-500 uppercase tracking-wider">{integration.status}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
                <span className="text-xs text-muted-foreground font-mono">LATÊNCIA</span>
                <span className="text-sm font-mono text-foreground">{integration.latency}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}