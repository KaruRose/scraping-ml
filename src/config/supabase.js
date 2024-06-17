import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

export const supabase = createClient(
  process.env.APP_SUPABASE_URL ?? '',
  process.env.APP_SUPABASE_TOKEN ?? ''
)
