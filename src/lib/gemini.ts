import { GoogleGenerativeAI, type GenerativeModel } from '@google/generative-ai'
import type { TriageResult, GeminiSummary } from '@/types'

const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
  throw new Error('Missing GEMINI_API_KEY environment variable')
}

const genAI = new GoogleGenerativeAI(apiKey)

const modelConfig = {
  temperature: 0.3,
  maxOutputTokens: 1024,
  responseMimeType: 'application/json',
}

export function getTriageModel(): GenerativeModel {
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash', ...modelConfig })
}

export function getSummaryModel(): GenerativeModel {
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash', ...modelConfig })
}

export function getEmbeddingModel() {
  return genAI.getGenerativeModel({ model: 'text-embedding-004' })
}

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const model = getEmbeddingModel()
    const result = await model.embedContent(text)
    return result.embedding.values
  } catch (error) {
    console.error('Error generating embedding:', error)
    return new Array(768).fill(0)
  }
}

export async function triageMessage(
  message: string,
  kbContext: string,
): Promise<TriageResult> {
  try {
    const model = getTriageModel()
    const prompt = buildTriagePrompt(message, kbContext)
    const result = await model.generateContent(prompt)
    const response = result.response.text()
    return JSON.parse(response) as TriageResult
  } catch (error) {
    console.error('Error in AI triage:', error)
    return {
      categoria: 'geral',
      confianca: 0,
      solucao_sugerida: '',
      kb_artigos: [],
      deve_escalar: true,
      prioridade: 'MEDIA',
    }
  }
}

export async function generateSummary(
  ticketTitle: string,
  ticketDescription: string,
  messages: string[],
): Promise<GeminiSummary> {
  try {
    const model = getSummaryModel()
    const prompt = buildSummaryPrompt(ticketTitle, ticketDescription, messages)
    const result = await model.generateContent(prompt)
    const response = result.response.text()
    return JSON.parse(response) as GeminiSummary
  } catch (error) {
    console.error('Error generating summary:', error)
    return {
      resumo: 'Nao foi possivel gerar o resumo.',
      acoes_recomendadas: [],
      contexto_relevante: '',
    }
  }
}

function buildTriagePrompt(message: string, kbContext: string): string {
  return `Voce e um especialista de triagem de suporte de TI para a Proxxima Telecom.

## INSTRUCOES
Analise a mensagem do colaborador e classifique o chamado. Use o contexto da base de conhecimento para sugerir solucoes.

## FORMATO DE RESPOSTA (JSON)
{
  "categoria": "email|rede|vpn|acesso|hardware|software|ponto|geral",
  "confianca": 0.0-1.0,
  "solucao_sugerida": "texto da solucao ou orientacao",
  "kb_artigos": [{"id": "uuid", "titulo": "titulo", "similarity": 0.0}],
  "deve_escalar": true/false,
  "prioridade": "BAIXA|MEDIA|ALTA|URGENTE"
}

## BASE DE CONHECIMENTO (Top 5 artigos mais relevantes)
${kbContext || 'Nenhum artigo relevante encontrado.'}

## MENSAGEM DO COLABORADOR
${message}

Retorne APENAS o JSON, sem texto adicional.`
}

function buildSummaryPrompt(
  title: string,
  description: string,
  messages: string[],
): string {
  return `Voce e um assistente de TI que resume chamados para a equipe tecnica.

## FORMATO DE RESPOSTA (JSON)
{
  "resumo": "resumo conciso do problema em 2-3 frases",
  "acoes_recomendadas": ["acao 1", "acao 2", "acao 3"],
  "contexto_relevante": "informacoes adicionais relevantes"
}

## CHAMADO
Titulo: ${title}
Descricao: ${description || 'Nao informada'}

## MENSAGENS TROCADAS
${messages.join('\n---\n') || 'Nenhuma mensagem adicional.'}

Retorne APENAS o JSON, sem texto adicional.`
}
