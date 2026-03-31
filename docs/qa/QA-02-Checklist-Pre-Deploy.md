# QA-02 — Checklist Pré-Deploy

  **Verificações Obrigatórias Antes de Qualquer Deploy em Produção**

  | Campo       | Valor                              |
  |-------------|-------------------------------------|
  | Versão      | v3.0                               |
  | Categoria   | Qualidade                         |
  | Ano         | 2025                               |

  > 🔒 Uso interno exclusivo — Equipe de Tecnologia da Informação

  ---

  ## Sumário

  1. [Código](#1-código)
  2. [Testes](#2-testes)
  3. [Banco de Dados](#3-banco-de-dados)
  4. [Variáveis de Ambiente](#4-variáveis-de-ambiente)
  5. [Integrações](#5-integrações)
  6. [Code Review](#6-code-review)
  7. [Pós-Deploy](#7-pós-deploy)

  ---

  ## Checklist

  ### 1. Código

  - [ ] Código compila sem erros: `npm run build`
  - [ ] ESLint sem warnings: `npm run lint`
  - [ ] TypeScript sem erros: `npm run type-check`
  - [ ] Nenhum `console.log` de debug esquecido
  - [ ] Nenhum `TODO` ou `FIXME` bloqueante
  - [ ] Nenhum segredo hardcoded no código

  ### 2. Testes

  - [ ] Cenários críticos testados em staging (QA-01 §2)
  - [ ] Bot responde mensagem de teste em staging
  - [ ] Sync de colaboradores executa sem erro em staging
  - [ ] Busca semântica na KB retorna resultados em staging

  ### 3. Banco de Dados

  - [ ] Migrations aplicadas em staging sem erro
  - [ ] Schema backward-compatible (ou migration de rollback pronta)
  - [ ] RLS ativo em todas as tabelas novas
  - [ ] Índices criados para novas queries

  ### 4. Variáveis de Ambiente

  - [ ] Todas as variáveis novas adicionadas ao Vercel (produção)
  - [ ] Valores de produção corretos (não de staging/dev)
  - [ ] Nenhum segredo exposto em logs ou código client-side

  ### 5. Integrações

  - [ ] Bot Zoho Cliq funcional em staging
  - [ ] GLPI acessível e respondendo
  - [ ] Gemini API respondendo com latência aceitável (< 3s)
  - [ ] REST API RH acessível

  ### 6. Code Review

  - [ ] PR aprovado por pelo menos 1 membro da equipe
  - [ ] Mudanças documentadas na PR description
  - [ ] Se mudança arquitetural: ADR atualizado

  ### 7. Pós-Deploy

  - [ ] Painel TI carrega sem erros em produção
  - [ ] Bot responde em produção
  - [ ] Logs Vercel sem erros 5xx
  - [ ] Próximo cron de sync executa com sucesso
  - [ ] Monitorar por 30 minutos (ARQ-05 §7)

  ---

  ## Quando Pular o Checklist

  **Nunca.** Mesmo para hotfixes, os itens 1 (código), 4 (variáveis), e 7 (pós-deploy) são obrigatórios.

  ---

  ## Histórico de Versões

  | Versão | Data    | Mudanças                                  |
  |--------|---------|-------------------------------------------|
  | 1.0    | 2025-01 | Criação: checklist básico                 |
  | 3.0    | 2025-03 | Itens de IA, migrations, segurança        |
  
---

*O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
