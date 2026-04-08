import { supabaseAdmin } from './supabase-admin'

const BUCKET_EVIDENCIAS = 'evidencias'

export interface UploadResult {
  path: string
  url: string
  error?: string
}

export async function uploadEvidencia(
  file: Buffer,
  fileName: string,
  tarefaId: string
): Promise<UploadResult> {
  try {
    const ext = fileName.split('.').pop() || 'jpg'
    const path = `${tarefaId}/${Date.now()}.${ext}`

    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_EVIDENCIAS)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: getMimeType(ext),
      })

    if (error) {
      return { path: '', url: '', error: error.message }
    }

    const { data: urlData } = supabaseAdmin.storage
      .from(BUCKET_EVIDENCIAS)
      .getPublicUrl(path)

    return {
      path: data.path,
      url: urlData.publicUrl,
    }
  } catch (error) {
    return {
      path: '',
      url: '',
      error: error instanceof Error ? error.message : 'Upload failed',
    }
  }
}

export async function uploadEvidenciaFromBase64(
  base64Data: string,
  tarefaId: string,
  mimeType: string = 'image/jpeg'
): Promise<UploadResult> {
  try {
    const ext = mimeType.split('/').pop() || 'jpg'
    const buffer = Buffer.from(base64Data, 'base64')
    const fileName = `evidence_${Date.now()}.${ext}`

    return uploadEvidencia(buffer, fileName, tarefaId)
  } catch (error) {
    return {
      path: '',
      url: '',
      error: error instanceof Error ? error.message : 'Upload failed',
    }
  }
}

export async function deleteEvidencia(path: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.storage
      .from(BUCKET_EVIDENCIAS)
      .remove([path])

    return !error
  } catch {
    return false
  }
}

export async function listEvidencias(tarefaId: string): Promise<string[]> {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_EVIDENCIAS)
      .list(tarefaId, {
        limit: 100,
        offset: 0,
      })

    if (error || !data) return []

    return data.map((file) => {
      const { data: urlData } = supabaseAdmin.storage
        .from(BUCKET_EVIDENCIAS)
        .getPublicUrl(`${tarefaId}/${file.name}`)
      return urlData.publicUrl
    })
  } catch {
    return []
  }
}

function getMimeType(ext: string): string {
  const types: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    pdf: 'application/pdf',
  }
  return types[ext.toLowerCase()] || 'application/octet-stream'
}
