import { createBrowserClient } from "@supabase/ssr";

export function getSupabaseConfig() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    key: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? "",
  };
}

export function hasSupabaseConfig() {
  const { url, key } = getSupabaseConfig();
  return Boolean(url && key);
}

export const createClient = () => {
  const { url, key } = getSupabaseConfig();

  if (!url || !key) {
    return null;
  }

  return createBrowserClient(url, key);
};
