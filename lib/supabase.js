import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mwckstcctnfcwzbrberf.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_jfhcXkALJN0QCIcugaXEpA_6mIIba_v';

export const supabase = createClient(supabaseUrl, supabaseKey);
