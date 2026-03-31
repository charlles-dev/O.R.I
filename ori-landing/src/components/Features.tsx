import { motion } from "framer-motion";
import { Terminal, ShieldAlert, Cpu, Network, Zap, Lock } from "lucide-react";

const features = [
  {
    title: "Triagem Inteligente",
    description: "Análise semântica de chamados em tempo real. O.R.I categoriza, prioriza e direciona tickets automaticamente, reduzindo o tempo de resposta em 60%.",
    icon: <Terminal className="h-6 w-6" />,
    color: "from-blue-500/20 to-primary/20",
    border: "group-hover:border-primary/50"
  },
  {
    title: "Resolução Autônoma",
    description: "40% das solicitações (reset de senha, dúvidas comuns, status de serviços) são resolvidas diretamente pelo bot, sem intervenção humana.",
    icon: <Zap className="h-6 w-6" />,
    color: "from-accent/20 to-pink-600/20",
    border: "group-hover:border-accent/50"
  },
  {
    title: "Gestão de Identidade",
    description: "Onboarding e Offboarding automatizados. Integração com o RH para criar contas, e-mails e permissões assim que o contrato é assinado.",
    icon: <ShieldAlert className="h-6 w-6" />,
    color: "from-purple-500/20 to-primary/20",
    border: "group-hover:border-purple-500/50"
  },
  {
    title: "Controle de Acesso RFID",
    description: "Cadastro de crachás Topdata via interface conversacional. O.R.I guia o usuário e sincroniza com o sistema iNControl instantaneamente.",
    icon: <Lock className="h-6 w-6" />,
    color: "from-emerald-500/20 to-primary/20",
    border: "group-hover:border-emerald-500/50"
  },
  {
    title: "Orquestração de Integrações",
    description: "Hub central que conecta GLPI, Zoho Cliq, Zentyal (AD) e sistemas internos em um único ponto de contato transparente para o usuário.",
    icon: <Network className="h-6 w-6" />,
    color: "from-orange-500/20 to-accent/20",
    border: "group-hover:border-orange-500/50"
  },
  {
    title: "Processamento Gemini 2.5",
    description: "Powered by Google Gemini 2.5 Flash. Compreensão de contexto profundo, tom corporativo e capacidade de lidar com ambiguidades perfeitamente.",
    icon: <Cpu className="h-6 w-6" />,
    color: "from-cyan-500/20 to-primary/20",
    border: "group-hover:border-cyan-500/50"
  }
];

export function Features() {
  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl lg:text-6xl mb-6 text-glow"
          >
            Automação de Ponta a Ponta
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            O.R.I não é apenas um chatbot de FAQ. É um agente operacional com capacidade de execução em múltiplos sistemas simultaneamente.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`group relative p-8 rounded-2xl border border-border bg-card/30 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:-translate-y-1 ${feature.border}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                <div className="mb-6 inline-flex p-3 rounded-xl bg-background border border-border text-foreground group-hover:scale-110 transition-transform duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}