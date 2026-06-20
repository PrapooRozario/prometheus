export interface ApiKey {
  id: string;
  user_id: string;
  name: string;
  service: string;
  key_hint: string;
  notes: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface ApiKeyRow extends ApiKey {
  encrypted_key: string;
  iv: string;
  auth_tag: string;
}

export interface GetApiKeysFilters {
  search?: string;
  service?: string;
  tags?: string[];
}
