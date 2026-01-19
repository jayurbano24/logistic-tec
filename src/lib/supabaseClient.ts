import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://smmpejfrpsxprqciiqcr.supabase.co';
const supabaseKey = 'sb_publishable_06RSuAidCQV-t8jiaPDSmQ_TZc847vT';

export const supabase = createClient(supabaseUrl, supabaseKey);
