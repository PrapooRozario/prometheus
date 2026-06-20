-- Add key_hint to api_keys
ALTER TABLE api_keys ADD COLUMN key_hint text;

-- Backfill with generic hint if any existing
UPDATE api_keys SET key_hint = 'xxxx';

-- Make it not null going forward
ALTER TABLE api_keys ALTER COLUMN key_hint SET NOT NULL;
