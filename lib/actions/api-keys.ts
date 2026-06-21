'use server'

import { createClient } from '@/lib/supabase/server'
import { encrypt, decrypt } from '@/lib/encryption'
import { createApiKeySchema, updateApiKeySchema } from '@/lib/schemas/api-key'
import { ApiKey, GetApiKeysFilters } from '@/types/api-key'

export async function createApiKey(formData: FormData) {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) throw new Error('Unauthorized')

  const rawData = {
    name: formData.get('name'),
    service: formData.get('service'),
    key: formData.get('key'),
  }

  const validation = createApiKeySchema.safeParse(rawData)
  if (!validation.success) {
    return { error: 'Validation failed', details: validation.error.flatten().fieldErrors }
  }

  const { encryptedKey, iv, authTag } = encrypt(validation.data.key)

  const { data, error } = await supabase
    .from('api_keys')
    .insert({
      user_id: user.id, // Defense in depth alongside RLS
      name: validation.data.name,
      service: validation.data.service,
      key_hint: validation.data.key.slice(-4).padStart(4, 'x'),
      encrypted_key: encryptedKey,
      iv: iv,
      auth_tag: authTag
    })
    .select('id, user_id, name, service, key_hint, created_at, updated_at')
    .single()

  if (error) {
    console.error('Create API Key Error:', error)
    return { error: 'Failed to create API key' }
  }

  return { data: data as ApiKey }
}

export async function getApiKeys(filters?: GetApiKeysFilters) {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) throw new Error('Unauthorized')

  let query = supabase
    .from('api_keys')
    .select('id, user_id, name, service, key_hint, created_at, updated_at')
    .eq('user_id', user.id) // Defense in depth alongside RLS

  if (filters?.search) {
    query = query.ilike('name', `%${filters.search}%`)
  }
  if (filters?.service) {
    query = query.eq('service', filters.service)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    console.error('Fetch API Keys Error:', error)
    return { error: 'Failed to fetch API keys' }
  }

  return { data: data as ApiKey[] }
}

export async function revealApiKey(id: string) {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('api_keys')
    .select('encrypted_key, iv, auth_tag')
    .eq('id', id)
    .eq('user_id', user.id) // Defense in depth alongside RLS
    .single()

  if (error || !data) {
    console.error('Reveal API Key Error:', error)
    return { error: 'API key not found or access denied' }
  }

  try {
    const plaintext = decrypt(data.encrypted_key, data.iv, data.auth_tag)
    return { data: plaintext }
  } catch (e) {
    console.error('Decryption failed for key:', id, e)
    return { error: 'Decryption failed' }
  }
}

export async function updateApiKey(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) throw new Error('Unauthorized')

  const rawData = {
    name: formData.get('name'),
    service: formData.get('service'),
    key: formData.get('key'),
  }

  const validation = updateApiKeySchema.safeParse(rawData)
  if (!validation.success) {
    return { error: 'Validation failed', details: validation.error.flatten().fieldErrors }
  }

  // Build the updates payload
  const updates: Record<string, any> = { updated_at: new Date().toISOString() }
  if (validation.data.name !== undefined) updates.name = validation.data.name
  if (validation.data.service !== undefined) updates.service = validation.data.service

  // Re-encrypt if a new key was provided and it's not empty string
  if (validation.data.key && validation.data.key.trim().length > 0) {
    const { encryptedKey, iv, authTag } = encrypt(validation.data.key)
    updates.encrypted_key = encryptedKey
    updates.iv = iv
    updates.auth_tag = authTag
    updates.key_hint = validation.data.key.slice(-4).padStart(4, 'x')
  }

  const { data, error } = await supabase
    .from('api_keys')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id) // Defense in depth alongside RLS
    .select('id, user_id, name, service, key_hint, created_at, updated_at')
    .single()

  if (error) {
    console.error('Update API Key Error:', error)
    return { error: 'Failed to update API key' }
  }

  return { data: data as ApiKey }
}

export async function deleteApiKey(id: string) {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('api_keys')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id) // Defense in depth alongside RLS

  if (error) {
    console.error('Delete API Key Error:', error)
    return { error: 'Failed to delete API key' }
  }

  return { success: true }
}
