# AI-10 — Integração Gemini API

  **Configuração, Endpoints, SDK e Exemplos de Código**

  | Campo       | Valor                              |
  |-------------|-------------------------------------|
  | Versão      | v3.0                               |
  | Categoria   | Inteligência Artificial            |
  | Ano         | 2025                               |

  > 🔒 Uso interno exclusivo — Equipe de Tecnologia da Informação

  ---

  ## Sumário

  1. [Configuração](#1-configuração)
  2. [SDK @google/generative-ai](#2-sdk)
  3. [Geração de Texto (Triagem)](#3-geração-de-texto)
  4. [Geração de Embeddings](#4-geração-de-embeddings)
  5. [Tratamento de Erros](#5-tratamento-de-erros)
  6. [Rate Limits e Custos](#6-rate-limits-e-custos)
  7. [Histórico de Versões](#7-histórico-de-versões)

  ---

  ## 1. Configuração

  ### Variável de ambiente

  ```
  GEMINI_API_KEY=<sua API key do Google AI Studio>
  ```

  ### Obter API key

  1. Acessar https://aistudio.google.com/apikey
  2. Criar nova API key
  3. Copiar e adicionar como variável de ambiente no Vercel

  ---

  ## 2. SDK

  ### Instalação

  ```bash
  npm install @google/generative-ai
  ```

  ### Inicialização

  ```typescript
  // lib/gemini.ts
  import { GoogleGenerativeAI } from '@google/generative-ai';

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

  export const geminiFlash = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.3,
      maxOutputTokens: 1024,
    },
  });

  export const embeddingModel = genAI.getGenerativeModel({
    model: 'text-embedding-004',
  });
  ```

  ---

  ## 3. Geração de Texto

  ### Triagem de chamado

  ```typescript
  import { geminiFlash } from '@/lib/gemini';

  interface TriagemResult {
    categoria: string;
    prioridade: string;
    confianca: number;
    resposta_colaborador: string;
    requer_ti: boolean;
    artigos_utilizados: string[];
    resumo_tecnico: string;
  }

  async function triarChamado(
    mensagem: string,
    colaborador: Colaborador,
    artigos: KBArticle[]
  ): Promise<TriagemResult> {
    const prompt = montarPromptTriagem(mensagem, colaborador, artigos);

    const result = await geminiFlash.generateContent(prompt);
    const text = result.response.text();

    return JSON.parse(text) as TriagemResult;
  }
  ```

  ### Resumo de chamado

  ```typescript
  async function resumirChamado(chamado: Chamado): Promise<string> {
    const prompt = `Resuma o seguinte chamado em 3 frases:
  Título: ${chamado.titulo}
  Descrição: ${chamado.descricao}`;

    const result = await geminiFlash.generateContent(prompt);
    return result.response.text();
  }
  ```

  ---

  ## 4. Geração de Embeddings

  ```typescript
  import { embeddingModel } from '@/lib/gemini';

  async function gerarEmbedding(texto: string): Promise<number[]> {
    const result = await embeddingModel.embedContent(texto);
    return result.embedding.values; // float[768]
  }
  ```

  ### Uso na KB

  ```typescript
  // Ao criar/editar artigo
  const embedding = await gerarEmbedding(artigo.titulo + ' ' + artigo.conteudo);

  await supabase
    .from('kb_artigos')
    .update({ embedding: JSON.stringify(embedding) })
    .eq('id', artigo.id);
  ```

  ### Uso na busca

  ```typescript
  // Ao receber mensagem do bot
  const queryEmbedding = await gerarEmbedding(mensagem);

  const { data: artigos } = await supabase.rpc('kb_busca_semantica', {
    query_embedding: JSON.stringify(queryEmbedding),
    limite: 5,
    threshold: 0.75,
  });
  ```

  ---

  ## 5. Tratamento de Erros

  ```typescript
  async function chamarGeminiComFallback(prompt: string): Promise<string | null> {
    try {
      const result = await geminiFlash.generateContent(prompt);
      return result.response.text();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`[gemini] Erro: ${error.message}`);

        if (error.message.includes('429')) {
          console.error('[gemini] Rate limit atingido');
        }
        if (error.message.includes('500') || error.message.includes('503')) {
          console.error('[gemini] API indisponível');
        }
      }
      return null; // Fallback: criar chamado GLPI sem triagem
    }
  }
  ```

  ---

  ## 6. Rate Limits e Custos

  ### Limites da API (plano gratuito)

  | Recurso              | Limite                    |
  |----------------------|---------------------------|
  | Requests/minuto      | 15 RPM (free) / 1.000+ (paid) |
  | Tokens/minuto        | 1M TPM (paid)             |
  | Tokens/dia           | Varia por plano            |

  ### Monitoramento de custos

  - Verificar em: https://aistudio.google.com/app/billing
  - Alerta configurado em 80% do orçamento mensal
  - Estimar: ~200 triagens/dia × ~2.000 tokens/triagem = ~400K tokens/dia

  ---

  ## 7. Histórico de Versões

  | Versão | Data    | Mudanças                              |
  |--------|---------|---------------------------------------|
  | 3.0    | 2025-03 | Criação: integração completa Gemini   |
  
---

*O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
