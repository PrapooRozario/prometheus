-- Create a trigger function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 1. Profiles Table
CREATE TABLE profiles (
    id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email text,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for profiles (Explicit policies for each operation)
CREATE POLICY "Users can select their own profile"
    ON profiles FOR SELECT
    USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (id = auth.uid());

CREATE POLICY "Users can delete their own profile"
    ON profiles FOR DELETE
    USING (id = auth.uid());

-- 2. API Keys Table
-- Why iv and auth_tag are stored as separate columns:
-- Storing the initialization vector (iv) and the GCM authentication tag separately 
-- rather than concatenating them into the `encrypted_key` ensures that the cryptographic
-- components remain highly explicit and auditable. It prevents potential parsing or 
-- boundary bugs during the decryption process (e.g., miscalculating byte offsets) 
-- and clearly signals the security properties (AES-GCM) to any reviewer or engineer 
-- working with the schema.
CREATE TABLE api_keys (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    service text NOT NULL,
    encrypted_key text NOT NULL,
    iv text NOT NULL,
    auth_tag text NOT NULL,
    notes text,
    tags text[] DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 3. Enable RLS for api_keys
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for api_keys (Explicit policies for each operation)
CREATE POLICY "Users can select their own api keys"
    ON api_keys FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own api keys"
    ON api_keys FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own api keys"
    ON api_keys FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own api keys"
    ON api_keys FOR DELETE
    USING (user_id = auth.uid());

-- 5. Trigger for updated_at on api_keys
CREATE TRIGGER update_api_keys_updated_at
    BEFORE UPDATE ON api_keys
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. Indexes
-- Index on (user_id, service) for fast filtering when fetching a user's keys for a specific service
CREATE INDEX api_keys_user_id_service_idx ON api_keys (user_id, service);

-- GIN index on tags array for fast tag-based filtering
CREATE INDEX api_keys_tags_gin_idx ON api_keys USING GIN (tags);
