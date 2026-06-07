import { createClient } from "@supabase/supabase-js";

// Priority: runtime window._env_ (Docker nginx injection) > build-time import.meta.env (Vite dev)
const _env = (typeof window !== "undefined" && window._env_) || {};

const supabaseUrl     = _env.VITE_SUPABASE_URL     || import.meta.env.VITE_SUPABASE_URL     || "";
const supabaseAnonKey = _env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(
  supabaseUrl     || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);
