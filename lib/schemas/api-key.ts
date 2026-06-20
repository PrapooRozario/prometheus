import { z } from 'zod';

// We process the tags field to handle comma separated strings from FormData
const tagsPreprocess = z.preprocess((val) => {
  if (typeof val === 'string') {
    return val ? val.split(',').map((s) => s.trim()).filter(Boolean) : [];
  }
  if (Array.isArray(val)) {
    return val.filter(v => typeof v === 'string').map(v => v.trim()).filter(Boolean);
  }
  return [];
}, z.array(z.string()));

export const createApiKeySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  service: z.string().min(1, 'Service is required'),
  key: z.string().min(1, 'Key is required'), // plaintext key input
  notes: z.string().optional(),
  tags: tagsPreprocess.optional().default([]),
});

export const updateApiKeySchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  service: z.string().min(1, 'Service is required').optional(),
  key: z.string().optional(), // optional on update
  notes: z.string().optional(),
  tags: tagsPreprocess.optional(),
});
