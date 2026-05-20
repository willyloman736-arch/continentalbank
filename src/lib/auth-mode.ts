export type AuthMode = "auto" | "local" | "supabase";

export function authMode(): AuthMode {
  const mode = process.env.AUTH_MODE ?? process.env.NEXT_PUBLIC_AUTH_MODE ?? "auto";
  return mode === "local" || mode === "supabase" ? mode : "auto";
}

export function supabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && !url.includes("placeholder") && !key.includes("placeholder"));
}

export function localAuthEnabled() {
  const mode = authMode();
  return mode === "local" || (mode === "auto" && !supabaseConfigured());
}

export function supabaseAuthEnabled() {
  return !localAuthEnabled() && supabaseConfigured();
}
