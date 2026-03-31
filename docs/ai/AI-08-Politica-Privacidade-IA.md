# AI-08 — Política de Privacidade de IA

  **Dados Enviados ao Google, Retenção e Conformidade LGPD**

  | Campo       | Valor                              |
  |-------------|-------------------------------------|
  | Versão      | v3.0                               |
  | Categoria   | Inteligência Artificial            |
  | Ano         | 2025                               |

  > 🔒 Uso interno exclusivo — Equipe de Tecnologia da Informação

  ---

  ## Sumário

  1. [Dados Enviados ao Google](#1-dados-enviados-ao-google)
  2. [Dados NÃO Enviados](#2-dados-não-enviados)
  3. [Política de Retenção do Google](#3-política-de-retenção-do-google)
  4. [Minimização de Dados](#4-minimização-de-dados)
  5. [Conformidade LGPD](#5-conformidade-lgpd)
  6. [Riscos e Mitigações](#6-riscos-e-mitigações)
  7. [Histórico de Versões](#7-histórico-de-versões)

  ---

  ## 1. Dados Enviados ao Google

  | Dado                          | Enviado | Motivo                                    |
  |-------------------------------|---------|-------------------------------------------|
  | Texto da mensagem do colaborador | Sim  | Necessário para triagem e classificação   |
  | Nome do colaborador            | Sim    | Contextualizar a resposta                 |
  | Setor e filial                 | Sim    | Melhorar precisão da classificação        |
  | Conteúdo dos artigos da KB     | Sim    | Contexto para a IA fundamentar resposta   |
  | E-mail do colaborador          | **Sim**| Identificação no prompt (minimizar futuramente) |

  ---

  ## 2. Dados NÃO Enviados

  | Dado                          | Enviado | Motivo                                    |
  |-------------------------------|---------|-------------------------------------------|
  | Matrícula                     | Não     | Não necessário para triagem               |
  | CPF / documentos pessoais     | Não     | Nunca incluído no prompt                  |
  | Dados financeiros             | Não     | Fora do escopo do O.R.I                   |
  | Senhas (em texto claro)       | Não     | Nunca trafegam no sistema                 |
  | Dados de ponto / jornada      | Não     | Fora do escopo da triagem                 |
  | Histórico completo do colaborador | Não | Apenas dados do chamado atual             |

  ---

  ## 3. Política de Retenção do Google

  Conforme a política da Google Generative AI API (google.com/policies):

  | Aspecto                        | Política                                     |
  |--------------------------------|----------------------------------------------|
  | Uso para treino                | Dados da API Gemini **não** são usados para treinar modelos (API, não AI Studio) |
  | Retenção de logs               | Logs podem ser retidos por até 30 dias para debug e abuso |
  | Processamento                  | Dados processados em infraestrutura Google (data centers globais) |
  | Exclusão                       | Dados são descartados após processamento (exceto logs temporários) |

  > ⚠ **IMPORTANTE:** Esta política se aplica ao uso via API (REST). O uso via Google AI Studio web pode ter políticas diferentes.

  ---

  ## 4. Minimização de Dados

  | Prática                                    | Status      |
  |---------------------------------------------|-------------|
  | Incluir apenas dados necessários no prompt  | Implementado|
  | Não enviar matrícula, CPF ou dados financeiros | Implementado |
  | Limitar artigos KB no prompt a top 5         | Implementado|
  | Avaliar remoção de e-mail do prompt          | Planejado   |

  ---

  ## 5. Conformidade LGPD

  | Requisito LGPD                    | Status                                          |
  |------------------------------------|-------------------------------------------------|
  | Base legal para tratamento         | Legítimo interesse (Art. 7, IX) — operação interna de TI |
  | Minimização de dados               | Apenas dados necessários enviados                |
  | Transparência                      | Colaboradores informados que o bot usa IA         |
  | Direito de acesso                  | Colaborador pode solicitar ao TI seus dados no audit_log |
  | Direito de exclusão                | Dados do audit_log retidos por 90 dias (operacional) |
  | Transferência internacional        | Dados processados em servidores do Google (fora do Brasil) — coberto pelo contrato Google |

  ---

  ## 6. Riscos e Mitigações

  | Risco                                    | Mitigação                                    |
  |-------------------------------------------|----------------------------------------------|
  | Dados pessoais no prompt                  | Minimização: apenas nome, setor, e-mail       |
  | Vazamento de dados via prompt injection   | Instruções claras + validação de input         |
  | Google muda política de retenção          | Monitorar comunicações do Google AI            |
  | Colaborador não sabe que IA é usada       | Comunicar na política interna de TI            |

  ---

  ## 7. Histórico de Versões

  | Versão | Data    | Mudanças                              |
  |--------|---------|---------------------------------------|
  | 3.0    | 2025-03 | Criação: política de privacidade IA   |
  
---

*O.R.I v3.0 — Uso interno exclusivo — Equipe de Tecnologia da Informação — Proxxima Telecom*
