# AI-07 — Prompt Engineering

  **Padrões de Prompt, Estrutura e Boas Práticas para o Gemini**

  | Campo       | Valor                              |
  |-------------|-------------------------------------|
  | Versão      | v3.0                               |
  | Categoria   | Inteligência Artificial            |
  | Ano         | 2025                               |

  > 🔒 Uso interno exclusivo — Equipe de Tecnologia da Informação

  ---

  ## Sumário

  1. [Princípios Gerais](#1-princípios-gerais)
  2. [Estrutura do Prompt](#2-estrutura-do-prompt)
  3. [Prompt de Triagem](#3-prompt-de-triagem)
  4. [Prompt de Resumo](#4-prompt-de-resumo)
  5. [Configurações do Modelo](#5-configurações-do-modelo)
  6. [Boas Práticas](#6-boas-práticas)
  7. [Histórico de Versões](#7-histórico-de-versões)

  ---

  ## 1. Princípios Gerais

  | Princípio                      | Aplicação no O.R.I                            |
  |---------------------------------|-----------------------------------------------|
  | Instruções claras e específicas | "Classifique..." em vez de "analise..."        |
  | Formato de saída definido       | `responseMimeType: "application/json"`       |
  | Contexto relevante incluído     | Artigos da KB no prompt                        |
  | Limitações explícitas           | "Use APENAS os artigos fornecidos"             |
  | Exemplos quando possível        | Few-shot com triagens de exemplo               |
  | Persona definida                | "Você é o O.R.I, assistente de TI"             |

  ---

  ## 2. Estrutura do Prompt

  Todo prompt do O.R.I segue a mesma estrutura:

  ```
  [1. PERSONA] — Quem o modelo é
  [2. INSTRUÇÕES] — O que deve fazer
  [3. FORMATO] — Como deve responder
  [4. CONTEXTO] — Dados relevantes (colaborador, artigos KB)
  [5. INPUT] — A mensagem/dado a ser processado
  ```

  ---

  ## 3. Prompt de Triagem

  ```
  [PERSONA]
  Você é o O.R.I (Operações, Recursos e Inteligência), assistente virtual de TI da Proxxima Telecom.

  [INSTRUÇÕES]
  1. Analise a mensagem do colaborador
  2. Classifique por categoria: email, rede, vpn, acesso, hardware, software, ponto, geral
  3. Defina prioridade: baixa, media, alta, critica
  4. Busque solução nos artigos da KB fornecidos
  5. Se encontrar solução nos artigos, responda com confiança alta (≥ 0.75)
  6. Se não encontrar solução adequada, responda com confiança baixa (< 0.75)

  [FORMATO]
  Responda em JSON com os seguintes campos:
  { categoria, prioridade, confianca, resposta_colaborador, requer_ti, artigos_utilizados, resumo_tecnico }

  [CONTEXTO]
  Colaborador: {nome} | Setor: {setor} | Filial: {filial}

  Artigos da KB relevantes:
  {artigos formatados com título e conteúdo}

  [INPUT]
  Mensagem do colaborador:
  "{mensagem}"
  ```

  ---

  ## 4. Prompt de Resumo

  ```
  [PERSONA]
  Você é o O.R.I, assistente de TI.

  [INSTRUÇÕES]
  Resuma o chamado em no máximo 3 frases.
  Inclua: problema principal, ações já tentadas, próximo passo recomendado.

  [INPUT]
  Título: {titulo}
  Colaborador: {nome} ({setor})
  Descrição: {descricao}
  Resposta IA: {resposta_ia}
  ```

  ---

  ## 5. Configurações do Modelo

  ```typescript
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.3,        // Baixo = mais determinístico
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 1024,
    },
  });
  ```

  | Parâmetro          | Valor | Motivo                                          |
  |--------------------|-------|--------------------------------------------------|
  | temperature        | 0.3   | Respostas consistentes (triagem não é criativa)  |
  | responseMimeType   | JSON  | Força resposta em JSON puro (sem markdown)        |
  | maxOutputTokens    | 1024  | Suficiente para resposta + resumo técnico         |

  ---

  ## 6. Boas Práticas

  | Prática                                    | Motivo                                    |
  |---------------------------------------------|-------------------------------------------|
  | Testar prompts com casos reais              | Validar antes de colocar em produção       |
  | Manter versão do prompt no código           | Rastreabilidade de mudanças                |
  | Nunca incluir dados desnecessários no prompt| Reduzir custo e risco de privacidade       |
  | Usar temperature baixa para classificação   | Consistência nas respostas                 |
  | Usar JSON como formato de saída             | Parsing confiável no código                |
  | Incluir exemplos de classificação correta   | Melhora a precisão (few-shot)              |

  ---

  ## 7. Histórico de Versões

  | Versão | Data    | Mudanças                              |
  |--------|---------|---------------------------------------|
  | 3.0    | 2025-03 | Criação: prompts de triagem e resumo  |
  
---

*O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
