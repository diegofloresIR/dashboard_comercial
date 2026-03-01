import { createClient, SupabaseClient } from '@supabase/supabase-js';

export let supabase: SupabaseClient;

export function initSupabase(url: string, key: string) {
    if (!supabase) {
        supabase = createClient(url, key);
    }
}
