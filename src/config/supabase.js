import { createClient } from '@supabase/supabase-js'
process.loadEnvFile()

export const supabase = createClient(
  process.env.APP_SUPABASE_URL ?? '',
  process.env.APP_SUPABASE_TOKEN ?? ''
)
