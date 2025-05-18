import { createBrowserClient } from "@supabase/ssr";
// Removed: import { Database } from "./database.types"; // Assuming you have this type

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
);