import { z } from 'zod';

export const ReturnTypeSchema = z.enum(['GSTR1', 'GSTR3B']);
export type ReturnType = z.infer<typeof ReturnTypeSchema>;

