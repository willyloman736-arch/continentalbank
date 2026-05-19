/**
 * Continental Bank — i18n dictionaries
 *
 * The architecture supports any number of locales. English is the only fully
 * translated locale today; other languages fall back gracefully.
 */

export const SUPPORTED_LOCALES = ["en", "fr", "de", "es", "it", "ar", "zh"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const RTL_LOCALES: Locale[] = ["ar"];

type Dict = Record<string, string>;

const en: Dict = {
  // Global
  "common.login": "Sign in",
  "common.register": "Open Account",
  "common.dashboard": "Dashboard",
  "common.logout": "Sign out",
  "common.cancel": "Cancel",
  "common.save": "Save",
  "common.submit": "Submit",
  "common.continue": "Continue",
  "common.back": "Back",
  "common.search": "Search",
  "common.loading": "Loading…",
  "common.email": "Email address",
  "common.password": "Password",

  // Nav
  "nav.private_clients": "Private Clients",
  "nav.services": "Services",
  "nav.global_reach": "Global Reach",
  "nav.contact": "Contact",

  // Hero
  "hero.eyebrow": "Established 1972 · Discreet Private Banking",
  "hero.title": "A private bank for a few who require precision.",
  "hero.subtitle":
    "Continental Bank offers institutional-grade wealth oversight, multi-currency portfolios, and an executive concierge for clients who value discretion above all.",
  "hero.cta_primary": "Open a private account",
  "hero.cta_secondary": "Speak with a private banker",

  // Trust
  "trust.eyebrow": "Trusted by principals worldwide",
  "trust.title": "Quiet stewardship, measured in decades.",
  "trust.description":
    "Continental Bank serves principals, family offices, and institutional clients with a tradition of discretion and continuity.",

  // Features
  "features.eyebrow": "The Portfolio",
  "features.title": "Tools your bankers use, made available to you.",

  // Auth
  "auth.welcome": "Welcome back",
  "auth.welcome_subtitle": "Sign in to your private client portal.",
  "auth.register_title": "Open a private account",
  "auth.register_subtitle":
    "Submit your details. A relationship manager will review and contact you shortly.",
  "auth.pending_title": "Application under review",
  "auth.pending_subtitle":
    "A relationship manager is reviewing your application. You will receive an email when your account is activated.",

  // Dashboard
  "dash.overview": "Overview",
  "dash.wallets": "Currency Accounts",
  "dash.transactions": "Transactions",
  "dash.withdrawals": "Withdrawals",
  "dash.support": "Support",
  "dash.profile": "Profile",
  "dash.security": "Security",
};

const fr: Dict = {
  "common.login": "Connexion",
  "common.register": "Ouvrir un compte",
  "common.dashboard": "Tableau de bord",
  "common.logout": "Déconnexion",
  "hero.title": "Une banque privée pour ceux qui exigent la précision.",
};

const de: Dict = {
  "common.login": "Anmelden",
  "common.register": "Konto eröffnen",
  "common.dashboard": "Übersicht",
  "common.logout": "Abmelden",
  "hero.title": "Eine Privatbank für jene, die Präzision verlangen.",
};

const es: Dict = {
  "common.login": "Iniciar sesión",
  "common.register": "Abrir cuenta",
  "common.dashboard": "Panel",
  "common.logout": "Cerrar sesión",
  "hero.title": "Una banca privada para quienes exigen precisión.",
};

const it: Dict = {
  "common.login": "Accedi",
  "common.register": "Apri un conto",
  "common.dashboard": "Pannello",
  "common.logout": "Esci",
  "hero.title": "Una banca privata per chi richiede precisione.",
};

const ar: Dict = {
  "common.login": "تسجيل الدخول",
  "common.register": "افتح حسابًا",
  "common.dashboard": "لوحة التحكم",
  "common.logout": "تسجيل الخروج",
  "hero.title": "مصرف خاص لمن يطلبون الدقة.",
};

const zh: Dict = {
  "common.login": "登录",
  "common.register": "开户",
  "common.dashboard": "控制台",
  "common.logout": "退出",
  "hero.title": "为追求精准的少数客户而设的私人银行。",
};

export const dictionaries: Record<Locale, Dict> = { en, fr, de, es, it, ar, zh };

/**
 * Server-safe translator. Falls back to English then to the key itself.
 */
export function getT(locale: Locale | undefined) {
  const dict = dictionaries[locale ?? DEFAULT_LOCALE] ?? dictionaries[DEFAULT_LOCALE];
  return (key: string) => dict[key] ?? dictionaries[DEFAULT_LOCALE][key] ?? key;
}
