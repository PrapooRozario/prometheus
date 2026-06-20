import crypto from 'crypto';

/**
 * Generate Master Key Script
 * 
 * Run this script to generate a cryptographically secure 32-byte (256-bit) 
 * key suitable for AES-256-GCM encryption.
 * 
 * Usage:
 * npx tsx scripts/generate-master-key.ts
 */

const key = crypto.randomBytes(32);
const base64Key = key.toString('base64');

console.log('\n--- ENCRYPTION MASTER KEY ---');
console.log(base64Key);
console.log('-----------------------------\n');
console.log('Copy the base64 value above and set it as ENCRYPTION_MASTER_KEY in your .env.local file.\n');
