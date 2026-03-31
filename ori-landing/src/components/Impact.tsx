import { motion } from "framer-motion";

export function Impact() {
  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl md:text-5xl mb-6 text-glow"
            >
              Escalabilidade <br />Sem Precedentes
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground mb-8 leading-relaxed"
            >
              O principal desafio da Proxxima Telecom era escalar o suporte de TI para acompanhar o crescimento exponencial do quadro de funcionários. Com o O.R.I, a equipe de TI deixou de ser um gargalo operacional e passou a focar em projetos estratégicos.
            </motion.p>
            
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-xl bg-card border border-border relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                <h4 className="text-xl font-bold mb-2 text-foreground">Redução de Carga de Trabalho</h4>
                <p className="text-muted-foreground text-sm">A triagem automática e resolução de chamados de Nível 1 economizam em média 40 horas semanais da equipe de infraestrutura.</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-xl bg-card border border-border relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent"></div>
                <h4 className="text-xl font-bold mb-2 text-foreground">SLA de Atendimento</h4>
                <p className="text-muted-foreground text-sm">O tempo de primeira resposta caiu de 45 minutos para menos de 3 segundos, disponível 24/7 para todas as filiais.</p>
              </motion.div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-[2rem] blur-3xl opacity-50"></div>
            <div className="relative aspect-square md:aspect-[4/3] rounded-[2rem] border border-border bg-card/80 backdrop-blur-xl overflow-hidden flex flex-col items-center justify-center p-8 text-center shadow-2xl">
              <div className="text-6xl md:text-8xl font-display text-transparent bg-clip-text bg-gradient-to-b from-white to-white/30 mb-4">
                750:1
              </div>
              <p className="text-xl font-bold uppercase tracking-widest text-primary mb-4">Proporção</p>
              <p className="text-muted-foreground max-w-sm">
                A eficiência do O.R.I permite que apenas 2 técnicos gerenciem as demandas operacionais de mais de 1.500 colaboradores em múltiplos estados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}