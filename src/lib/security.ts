import { createHmac, timingSafeEqual } from 'crypto'

export function verifyHmacSignature(
  secret: string,
  signature: string,
  payload: string,
): boolean {
  const expected = createHmac('sha256', secret).update(payload).digest('hex')
  const expectedBuffer = Buffer.from(expected)
  const signatureBuffer = Buffer.from(signature)

  if (expectedBuffer.length !== signatureBuffer.length) {
    return false
  }

  return timingSafeEqual(expectedBuffer, signatureBuffer)
}

export function generateHmacSignature(secret: string, payload: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex')
}

export function verifyZohoDomain(origin: string): boolean {
  const allowedDomains = ['zoho.com', 'zohocliq.com', 'zoho.com.br']
  return allowedDomains.some((domain) => origin.endsWith(domain))
}
