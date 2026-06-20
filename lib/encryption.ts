import crypto from 'crypto';

/**
 * ENCRYPTION SERVICE
 * 
 * WARNING: This file must ONLY ever be imported in server-side code (e.g., API Routes, Server Actions).
 * It contains logic that relies on the secret master key, which must never be exposed to the client.
 * 
 * Note on Key Model: This implements a Server-Side master key model. It does NOT implement
 * any key derivation from user passwords (zero-knowledge encryption). The server has full
 * capability to encrypt/decrypt all records using ENCRYPTION_MASTER_KEY.
 */

if (typeof window !== 'undefined') {
  throw new Error('SECURITY VIOLATION: encryption.ts imported on the client side. This module is server-only.');
}

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 12 bytes is standard and recommended for GCM

// Read and validate the master key once at module load
const MASTER_KEY_B64 = process.env.ENCRYPTION_MASTER_KEY || '';

if (!MASTER_KEY_B64) {
  throw new Error('STARTUP ERROR: ENCRYPTION_MASTER_KEY environment variable is not set.');
}

const MASTER_KEY = Buffer.from(MASTER_KEY_B64, 'base64');

if (MASTER_KEY.length !== 32) {
  throw new Error(`STARTUP ERROR: ENCRYPTION_MASTER_KEY must be exactly 32 bytes (256 bits) when base64-decoded. Received ${MASTER_KEY.length} bytes.`);
}

export function encrypt(plaintext: string): { encryptedKey: string; iv: string; authTag: string } {
  // Generate a fresh random 12-byte IV for every single encryption call (never reuse)
  const iv = crypto.randomBytes(IV_LENGTH);
  
  const cipher = crypto.createCipheriv(ALGORITHM, MASTER_KEY, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  const authTag = cipher.getAuthTag();

  return {
    encryptedKey: encrypted,
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
  };
}

export function decrypt(encryptedKey: string, iv: string, authTag: string): string {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    MASTER_KEY,
    Buffer.from(iv, 'base64')
  );
  
  decipher.setAuthTag(Buffer.from(authTag, 'base64'));

  let decrypted = decipher.update(encryptedKey, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
