# DEV-02 — Padrões de Código

  **Convenções, Estilo, Nomenclatura e Boas Práticas de Desenvolvimento**

  | Campo       | Valor                              |
  |-------------|-------------------------------------|
  | Versão      | v3.0                               |
  | Categoria   | Desenvolvimento                   |
  | Ano         | 2025                               |

  > 🔒 Uso interno exclusivo — Equipe de Tecnologia da Informação

  ---

  ## Sumário

  1. [Stack Tecnológico](#1-stack-tecnológico)
  2. [Nomenclatura](#2-nomenclatura)
  3. [Estrutura de Arquivos](#3-estrutura-de-arquivos)
  4. [TypeScript](#4-typescript)
  5. [API Routes](#5-api-routes)
  6. [Componentes React](#6-componentes-react)
  7. [Tratamento de Erros](#7-tratamento-de-erros)
  8. [Git e Commits](#8-git-e-commits)
  9. [Histórico de Versões](#9-histórico-de-versões)

  ---

  ## 1. Stack Tecnológico

  | Tecnologia       | Versão   | Uso                                      |
  |------------------|----------|------------------------------------------|
  | Next.js          | 14       | Framework full-stack (App Router)        |
  | TypeScript       | 5.x      | Linguagem principal                      |
  | React            | 18       | UI do painel TI                          |
  | Tailwind CSS     | 3.x      | Estilização                              |
  | @supabase/supabase-js | 2.x | Cliente Supabase                        |
  | ESLint           | 8.x      | Linting                                 |
  | Prettier         | 3.x      | Formatação                               |

  ---

  ## 2. Nomenclatura

  | Item                 | Convenção           | Exemplo                          |
  |----------------------|---------------------|------------------------------------|
  | Arquivos TypeScript  | camelCase           | `geminiClient.ts`                |
  | Componentes React    | PascalCase          | `TaskCard.tsx`                   |
  | Variáveis e funções  | camelCase           | `const totalTarefas = ...`       |
  | Constantes           | UPPER_SNAKE_CASE    | `const MAX_RETRY = 3`           |
  | Tipos e interfaces   | PascalCase          | `interface Colaborador { ... }`  |
  | Enums                | PascalCase          | `enum StatusTarefa { ... }`      |
  | Tabelas SQL          | snake_case          | `tarefas_manuais`                |
  | Variáveis de ambiente| UPPER_SNAKE_CASE    | `SUPABASE_SERVICE_KEY`           |
  | Branches Git         | kebab-case          | `feature/triagem-ia`             |
  | Commits              | Português, imperativo| `Adicionar busca semântica na KB` |

  ---

  ## 3. Estrutura de Arquivos

  ```
  src/
    app/
      (painel)/
        dashboard/page.tsx
        tarefas/page.tsx
        chamados/page.tsx
        kb/page.tsx
      api/
        bot/mensagem/route.ts
        colaboradores/sync/route.ts
        tarefas/route.ts
        chamados/route.ts
        kb/busca/route.ts
        kb/artigos/route.ts
      layout.tsx
      globals.css
    components/
      ui/           # Componentes base (Button, Card, Input)
      tarefas/      # Componentes específicos de tarefas
      chamados/     # Componentes específicos de chamados
      kb/           # Componentes da KB
    lib/
      supabase.ts   # Cliente Supabase configurado
      gemini.ts     # Cliente Gemini configurado
      zoho.ts       # Cliente Zoho configurado
      glpi.ts       # Cliente GLPI configurado
      validators.ts # Validadores (hierarchy, HMAC)
    types/
      index.ts      # Tipos globais
      database.ts   # Tipos gerados do Supabase
  ```

  ---

  ## 4. TypeScript

  ### Regras obrigatórias

  - `strict: true` no `tsconfig.json`
  - Nunca usar `any` — usar `unknown` e narrowing
  - Tipos explícitos para parâmetros de função e retornos
  - Interfaces para objetos de domínio, types para unions e utilitários

  ### Exemplo

  ```typescript
  interface Colaborador {
    id: string;
    matricula: string;
    nomeCompleto: string;
    emailCorporativo: string | null;
    setor: string;
    status: 'ativo' | 'desligado' | 'ferias' | 'afastado';
  }

  async function buscarColaborador(email: string): Promise<Colaborador | null> {
    const { data, error } = await supabase
      .from('colaboradores')
      .select('*')
      .eq('email_corporativo', email)
      .single();

    if (error) throw new AppError('Colaborador não encontrado', 404);
    return data;
  }
  ```

  ---

  ## 5. API Routes

  ### Padrão de resposta

  ```typescript
  // Sucesso
  return Response.json({ data: resultado }, { status: 200 });

  // Erro
  return Response.json({ error: 'Mensagem descritiva' }, { status: 400 });
  ```

  ### Validação de input

  Sempre validar o corpo da requisição antes de processar. Usar Zod para validação.

  ### Logging

  ```typescript
  console.log(`[sync] Novos: ${novos}, Alterados: ${alterados}`);
  console.error(`[bot] Erro ao processar mensagem: ${error.message}`);
  ```

  ---

  ## 6. Componentes React

  - Server Components por padrão — usar `"use client"` apenas quando necessário
  - Componentes pequenos e focados — máximo ~150 linhas
  - Props tipadas com interface
  - Evitar lógica de negócio em componentes — mover para `/lib`

  ---

  ## 7. Tratamento de Erros

  | Camada           | Estratégia                                            |
  |------------------|-------------------------------------------------------|
  | API Routes       | Try/catch com resposta HTTP adequada                   |
  | Clientes externos| Retry com backoff exponencial (máx. 3 tentativas)     |
  | Supabase         | Verificar `error` do retorno antes de usar `data` |
  | Gemini API       | Fallback: criar chamado GLPI sem triagem               |
  | Frontend         | Error boundaries + toast notifications                 |

  ---

  ## 8. Git e Commits

  ### Mensagens de commit (em português)

  ```
  Adicionar triagem de chamados com Gemini 2.5 Flash
  Corrigir validação hierárquica para e-mails case-insensitive
  Remover agente interno e regras de firewall legadas
  ```

  ### Branches

  - `feature/nome`: nova funcionalidade
  - `fix/nome`: correção de bug
  - `hotfix/nome`: correção urgente em produção

  ---

  ## 9. Histórico de Versões

  | Versão | Data    | Mudanças                              |
  |--------|---------|---------------------------------------|
  | 1.0    | 2025-01 | Criação: padrões básicos              |
  | 3.0    | 2025-03 | TypeScript strict, Zod, Gemini client |
  
---

*O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
