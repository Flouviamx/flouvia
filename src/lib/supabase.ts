import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL;
// Service role key bypasses RLS — safe because every caller is SSR (key never reaches the browser).
// Falls back to anon key in local dev when the service key is absent.
const supabaseKey =
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY ?? import.meta.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
