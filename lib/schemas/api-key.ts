import { z } from 'zod';

export const createApiKeySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  service: z.string().min(1, 'Service is required'),
  key: z.string().min(1, 'Key is required'), // plaintext key input
});

export const updateApiKeySchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  service: z.string().min(1, 'Service is required').optional(),
  key: z.string().optional(), // optional on update
});
