import { createBrowserClient } from '@supabase/ssr'

// Kita simpan instance di luar fungsi agar HANYA DIBUAT SATU KALI
let supabase;

export const createClient = () => {
  if (supabase) return supabase;

  supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );

  return supabase;
}