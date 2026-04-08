const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID!
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET!
const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN!

let accessToken: string | null = null
let tokenExpiry = 0

async function getAccessToken(): Promise<string> {
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken
  }

  const response = await fetch('https://accounts.zoho.com/oauth/v2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: ZOHO_CLIENT_ID,
      client_secret: ZOHO_CLIENT_SECRET,
      refresh_token: ZOHO_REFRESH_TOKEN,
    }),
  })

  if (!response.ok) {
    throw new Error(`Zoho token refresh failed: ${response.statusText}`)
  }

  const data = await response.json()
  accessToken = data.access_token
  tokenExpiry = Date.now() + (data.expires_in - 300) * 1000

  return accessToken
}

export async function sendMessage(
  chatId: string,
  message: string,
): Promise<boolean> {
  const token = await getAccessToken()

  const response = await fetch(`https://cliq.zoho.com/api/v2/chats/byname/${chatId}/message`, {
    method: 'POST',
    headers: {
      'Authorization': `Zoho-oauthtoken ${token}`,
      'Content-Type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify({ message }),
  })

  return response.ok
}

export async function sendCard(
  chatId: string,
  card: Record<string, unknown>,
): Promise<boolean> {
  const token = await getAccessToken()

  const response = await fetch(`https://cliq.zoho.com/api/v2/chats/byname/${chatId}/message`, {
    method: 'POST',
    headers: {
      'Authorization': `Zoho-oauthtoken ${token}`,
      'Content-Type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify({
      card,
    }),
  })

  return response.ok
}

export async function sendTriageCard(
  chatId: string,
  ticketTitle: string,
  category: string,
  confidence: number,
  solution: string,
  escalated: boolean,
  glpiId?: number,
): Promise<boolean> {
  const card = {
    theme: escalated ? 'warning' : 'success',
    title: { text: ticketTitle },
    sections: [
      {
        title: { text: 'Classificacao' },
        rows: [
          { title: { text: 'Categoria' }, value: { text: category } },
          { title: { text: 'Confianca' }, value: { text: `${(confidence * 100).toFixed(0)}%` } },
          { title: { text: 'Status' }, value: { text: escalated ? 'Escalado para TI' : 'Resolvido pelo Bot' } },
          ...(glpiId ? [{ title: { text: 'GLPI' }, value: { text: `#${glpiId}` } }] : []),
        ],
      },
      ...(solution ? [{
        title: { text: 'Solucao Sugerida' },
        text: { text: solution },
      }] : []),
    ],
    actions: escalated ? [] : [
      {
        label: 'Resolvido',
        type: 'positive',
        action: { type: 'invoke.function', name: 'mark_resolved' },
      },
      {
        label: 'Escalar para TI',
        type: 'negative',
        action: { type: 'invoke.function', name: 'escalate_to_ti' },
      },
    ],
  }

  return sendCard(chatId, card)
}

export async function sendTaskCard(
  chatId: string,
  technicianChatId: string,
  taskTitle: string,
  taskType: string,
  collaboratorName: string,
  sla: string,
): Promise<boolean> {
  const card = {
    theme: 'info',
    title: { text: `Nova Tarefa: ${taskTitle}` },
    sections: [
      {
        rows: [
          { title: { text: 'Tipo' }, value: { text: taskType } },
          { title: { text: 'Colaborador' }, value: { text: collaboratorName } },
          { title: { text: 'SLA' }, value: { text: sla } },
        ],
      },
    ],
    actions: [
      {
        label: 'Ver no Painel',
        type: 'link',
        action: { type: 'open.link', link: `${process.env.NEXT_PUBLIC_APP_URL}/painel/tarefas` },
      },
    ],
  }

  return sendCard(technicianChatId, card)
}

export async function sendNotification(
  chatId: string,
  title: string,
  message: string,
  theme: 'info' | 'success' | 'warning' | 'danger' = 'info',
): Promise<boolean> {
  const card = {
    theme,
    title: { text: title },
    text: { text: message },
  }

  return sendCard(chatId, card)
}

export async function refreshZohoToken(): Promise<boolean> {
  try {
    await getAccessToken()
    return true
  } catch {
    return false
  }
}
