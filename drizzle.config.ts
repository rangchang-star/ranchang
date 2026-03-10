import type { Config } from 'drizzle-kit';
import { config } from 'dotenv';

config({ path: '.env.local' });

export default {
  schema: './src/storage/database/supabase/schema.ts',
  out: './src/storage/database/supabase/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://postgres:Zy818989@pgm-bp1hq894uq1918e5no.pg.rds.aliyuncs.com:5432/ran_field?sslmode=disable',
  },
  schemaFilter: ['public'],
} satisfies Config;
