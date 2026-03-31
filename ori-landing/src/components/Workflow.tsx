import { motion } from "framer-motion";
import { Bot, User, Database, CheckCircle2 } from "lucide-react";

export function Workflow() {
  return (
    <section className="py-32 relative bg-secondary/10 border-y border-border">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl mb-6 text-glow"
          >
            Resolução Silenciosa
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Como um chamado de TI passa de um pedido em linguagem natural para uma ação executada no sistema em segundos.
          </motion.p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent -translate-y-1/2 opacity-30"></div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-card border border-border flex items-center justify-center mb-6 relative z-10 shadow-lg shadow-black/50">
                <User className="h-6 w-6 text-muted-foreground" />
              </div>
              <h4 className="font-bold mb-2">1. Solicitação</h4>
              <p className="text-sm text-muted-foreground">Colaborador envia mensagem no Zoho Cliq relatando o problema.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/20 border border-primary/50 flex items-center justify-center mb-6 relative z-10 shadow-[0_0_20px_rgba(43,56,140,0.4)]">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-bold mb-2">2. Interpretação</h4>
              <p className="text-sm text-muted-foreground">Gemini 2.5 analisa o contexto, intenção e parâmetros da solicitação.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="relative text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-accent/20 border border-accent/50 flex items-center justify-center mb-6 relative z-10 shadow-[0_0_20px_rgba(227,32,133,0.4)]">
                <Database className="h-6 w-6 text-accent" />
              </div>
              <h4 className="font-bold mb-2">3. Execução</h4>
              <p className="text-sm text-muted-foreground">O.R.I aciona as APIs necessárias (GLPI, AD, etc) para resolver ou triar.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="relative text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mb-6 relative z-10 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              </div>
              <h4 className="font-bold mb-2">4. Resolução</h4>
              <p className="text-sm text-muted-foreground">Usuário é notificado da conclusão ou do número do chamado aberto.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}