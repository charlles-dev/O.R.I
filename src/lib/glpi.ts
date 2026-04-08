const GLPI_URL = process.env.GLPI_URL!
const GLPI_APP_TOKEN = process.env.GLPI_APP_TOKEN!
const GLPI_USER_TOKEN = process.env.GLPI_USER_TOKEN!

let sessionToken: string | null = null
let sessionExpiry = 0

async function getSessionToken(): Promise<string> {
  if (sessionToken && Date.now() < sessionExpiry) {
    return sessionToken
  }

  const response = await fetch(`${GLPI_URL}/initSession`, {
    method: 'GET',
    headers: {
      'App-Token': GLPI_APP_TOKEN,
      'Authorization': `user_token ${GLPI_USER_TOKEN}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`GLPI init session failed: ${response.statusText}`)
  }

  const data = await response.json()
  sessionToken = data.session_token
  sessionExpiry = Date.now() + 55 * 60 * 1000

  return sessionToken
}

export async function killSession(): Promise<void> {
  if (!sessionToken) return

  try {
    await fetch(`${GLPI_URL}/killSession`, {
      method: 'GET',
      headers: {
        'App-Token': GLPI_APP_TOKEN,
        'Session-Token': sessionToken,
      },
    })
  } catch {
    // Ignore cleanup errors
  }

  sessionToken = null
  sessionExpiry = 0
}

export async function createTicket(data: {
  name: string
  content: string
  categories_id?: number
  urgency?: number
  users_id_recipient?: number
}): Promise<{ id: number; error?: string }> {
  const sessionToken = await getSessionToken()

  const input = {
    input: {
      name: data.name,
      content: data.content,
      ...(data.categories_id && { categories_id: data.categories_id }),
      ...(data.urgency && { urgency: data.urgency }),
      ...(data.users_id_recipient && { users_id_recipient: data.users_id_recipient }),
    },
  }

  const response = await fetch(`${GLPI_URL}/Ticket`, {
    method: 'POST',
    headers: {
      'App-Token': GLPI_APP_TOKEN,
      'Session-Token': sessionToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const error = await response.text()
    return { id: 0, error }
  }

  const result = await response.json()
  return { id: result[0]?.id || 0 }
}

export async function getTicket(id: number): Promise<Record<string, unknown> | null> {
  const sessionToken = await getSessionToken()

  const response = await fetch(`${GLPI_URL}/Ticket/${id}`, {
    method: 'GET',
    headers: {
      'App-Token': GLPI_APP_TOKEN,
      'Session-Token': sessionToken,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) return null
  return response.json()
}

export async function updateTicket(
  id: number,
  data: Record<string, unknown>,
): Promise<boolean> {
  const sessionToken = await getSessionToken()

  const response = await fetch(`${GLPI_URL}/Ticket/${id}`, {
    method: 'PUT',
    headers: {
      'App-Token': GLPI_APP_TOKEN,
      'Session-Token': sessionToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ input: data }),
  })

  return response.ok
}

export async function addFollowup(
  ticketId: number,
  content: string,
): Promise<boolean> {
  const sessionToken = await getSessionToken()

  const response = await fetch(`${GLPI_URL}/Ticket/${ticketId}/ITILFollowup`, {
    method: 'POST',
    headers: {
      'App-Token': GLPI_APP_TOKEN,
      'Session-Token': sessionToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: {
        items_id: ticketId,
        itemtype: 'Ticket',
        content,
      },
    }),
  })

  return response.ok
}

export async function searchTickets(params: {
  criteria?: string
  range?: string
  sort?: string
  order?: string
}): Promise<Record<string, unknown>[]> {
  const sessionToken = await getSessionToken()

  const query = new URLSearchParams()
  if (params.criteria) query.set('criteria', params.criteria)
  if (params.range) query.set('range', params.range)
  if (params.sort) query.set('sort', params.sort)
  if (params.order) query.set('order', params.order)

  const response = await fetch(`${GLPI_URL}/search/Ticket?${query}`, {
    method: 'GET',
    headers: {
      'App-Token': GLPI_APP_TOKEN,
      'Session-Token': sessionToken,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) return []
  return response.json()
}

export async function searchCategories(search: string): Promise<Record<string, unknown>[]> {
  const sessionToken = await getSessionToken()

  const response = await fetch(
    `${GLPI_URL}/search/ITILCategory?criteria=[{"link":"AND","field":1,"searchterm":"${search}"}]`,
    {
      method: 'GET',
      headers: {
        'App-Token': GLPI_APP_TOKEN,
        'Session-Token': sessionToken,
        'Content-Type': 'application/json',
      },
    },
  )

  if (!response.ok) return []
  return response.json()
}

const priorityMap: Record<string, number> = {
  BAIXA: 1,
  MEDIA: 3,
  ALTA: 4,
  URGENTE: 5,
}

const categoryMap: Record<string, number> = {
  email: 1,
  rede: 2,
  vpn: 3,
  acesso: 4,
  hardware: 5,
  software: 6,
  ponto: 7,
  geral: 8,
}

export { priorityMap, categoryMap }
