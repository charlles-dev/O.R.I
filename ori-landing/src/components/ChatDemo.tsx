import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Send, Bot, User, CheckCircle2 } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
}

const SCENARIOS = [
  {
    label: "Resetar minha senha",
    userMessage: "Preciso resetar a minha senha do sistema GLPI.",
    botResponse: "Entendido. Verifiquei que sua conta está ativa. Acabei de enviar um link seguro para o seu e-mail corporativo (***@proxxima.net) com as instruções para redefinição. Posso ajudar com algo mais?"
  },
  {
    label: "Abrir chamado",
    userMessage: "Meu computador não está conectando na VPN.",
    botResponse: "Certo. Identifiquei que você está na filial de Campina Grande. Abri o chamado #45992 no GLPI e direcionei para a equipe de Infraestrutura. A prioridade foi definida como ALTA. Você receberá atualizações por aqui."
  },
  {
    label: "Cadastrar crachá",
    userMessage: "Gostaria de cadastrar meu novo crachá RFID.",
    botResponse: "Perfeito! O processo é simples. Aproxime seu novo crachá da leitora na recepção e digite o código de 6 dígitos que aparecerá no visor abaixo. Aguardo o código."
  },
  {
    label: "Status de integração",
    userMessage: "O sistema Zoho Cliq está fora do ar?",
    botResponse: "Fiz uma verificação nos nossos serviços. A API do Zoho Cliq está operando normalmente (latência: 45ms). O problema parece ser na sua conexão local. Sugiro reiniciar o roteador da sua mesa."
  }
];

const KEYWORD_MAP: Record<string, number> = {
  senha: 0, resetar: 0, reset: 0, password: 0,
  chamado: 1, vpn: 1, problema: 1, ticket: 1, abrir: 1,
  cracha: 2, crachá: 2, rfid: 2, cadastrar: 2,
  status: 3, zoho: 3, integração: 3, integracao: 3, fora: 3,
};

function matchScenario(text: string): typeof SCENARIOS[0] | null {
  const lower = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  for (const [keyword, idx] of Object.entries(KEYWORD_MAP)) {
    const normalizedKeyword = keyword.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (lower.includes(normalizedKeyword)) return SCENARIOS[idx];
  }
  return null;
}

export function ChatDemo() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "bot",
      text: "Olá! Sou o O.R.I, seu assistente de Operações, Recursos e Inteligência da Proxxima Telecom. Como posso otimizar seu dia hoje?"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendBotResponse = (responseText: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const newBotMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: responseText
      };
      setMessages(prev => [...prev, newBotMsg]);
    }, 2000);
  };

  const handleScenarioClick = (scenario: typeof SCENARIOS[0]) => {
    if (isTyping) return;
    
    const newUserMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: scenario.userMessage
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    sendBotResponse(scenario.botResponse);
  };

  const handleInputSubmit = () => {
    const text = inputValue.trim();
    if (!text || isTyping) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text
    };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");

    const matched = matchScenario(text);
    if (matched) {
      sendBotResponse(matched.botResponse);
    } else {
      sendBotResponse("Entendi sua solicitação. Vou analisar o contexto e encaminhar para a equipe adequada. Enquanto isso, você pode experimentar os cenários ao lado para ver minhas capacidades em ação.");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl border border-border bg-card/50 backdrop-blur-xl overflow-hidden shadow-2xl shadow-primary/10 flex flex-col md:flex-row relative z-10">
      
      {/* Sidebar Scenarios */}
      <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-border bg-background/50 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/50">
            <Terminal className="text-primary h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg">Testar O.R.I</h3>
            <p className="text-xs text-muted-foreground">Simulação em tempo real</p>
          </div>
        </div>
        
        <div className="space-y-3 flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Escolha um cenário</p>
          {SCENARIOS.map((scenario, idx) => (
            <button
              key={idx}
              onClick={() => handleScenarioClick(scenario)}
              disabled={isTyping}
              className="w-full text-left p-4 rounded-xl border border-border/50 bg-card/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{scenario.label}</span>
                <Send className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-full md:w-2/3 h-[500px] flex flex-col bg-card/10">
        <div className="flex-1 p-6 overflow-y-auto space-y-6" ref={scrollRef}>
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-4 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                  msg.sender === "bot" 
                    ? "bg-accent/20 border border-accent/50 text-accent" 
                    : "bg-secondary border border-border text-foreground"
                }`}>
                  {msg.sender === "bot" ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
                </div>
                
                <div className={`max-w-[80%] rounded-2xl p-4 ${
                  msg.sender === "bot"
                    ? "bg-card border border-border rounded-tl-sm"
                    : "bg-primary text-primary-foreground rounded-tr-sm"
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  <div className={`text-[10px] mt-2 flex items-center gap-1 opacity-70 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <span>{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    {msg.sender === "user" && <CheckCircle2 className="h-3 w-3" />}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex gap-4 flex-row"
              >
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-accent/20 border border-accent/50 text-accent flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="bg-card border border-border rounded-2xl rounded-tl-sm p-4 flex items-center gap-1.5 h-[52px]">
                  <div className="w-2 h-2 rounded-full bg-accent dot-typing"></div>
                  <div className="w-2 h-2 rounded-full bg-accent dot-typing"></div>
                  <div className="w-2 h-2 rounded-full bg-accent dot-typing"></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="p-4 border-t border-border bg-background/50">
          <form onSubmit={(e) => { e.preventDefault(); handleInputSubmit(); }} className="relative">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isTyping}
              placeholder="Digite sua solicitação ou escolha um cenário..." 
              className="w-full bg-card border border-border rounded-full py-3 px-6 pr-12 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={isTyping || !inputValue.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4 text-primary" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}