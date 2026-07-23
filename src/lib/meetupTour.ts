export interface MeetupTourContent {
  registration_open: boolean;
  hero_title: string;
  hero_subtitle: string;
  description: string;
  button_text: string;
  districts: string[];
  success_message: string;
  closed_message: string;
  seo_title: string;
  seo_description: string;
}

export const defaultMeetupTourContent: MeetupTourContent = {
  registration_open: true,
  hero_title: "Kashmir Meet-Up Tour 2026",
  hero_subtitle: "One Valley. One Journey. One Community.",
  description:
    "I'm coming to every district of Kashmir to meet creators, students, entrepreneurs, and anyone. Register below and I'll notify you when I visit your district.",
  button_text: "Register Now",
  districts: [
    "Srinagar",
    "Pulwama",
    "Kupwara",
    "Baramulla",
    "Bandipora",
    "Ganderbal",
    "Budgam",
    "Shopian",
    "Kulgam",
    "Anantnag",
  ],
  success_message:
    "You're registered! We'll notify you on WhatsApp when RJ Mursal visits your district.",
  closed_message: "Registrations are currently closed.",
  seo_title: "Kashmir Meet-Up Tour 2026 — Register | RJMursal",
  seo_description:
    "Join the Kashmir Meet-Up Tour 2026. Register from any district and get notified when RJ Mursal visits your area.",
};

/** Normalize to digits-only storage key (91 + 10-digit Indian mobile). */
export function normalizeWhatsapp(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 11 && digits.startsWith("0")) return `91${digits.slice(1)}`;
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  return digits;
}

export function isValidWhatsapp(input: string): boolean {
  const normalized = normalizeWhatsapp(input);
  return /^91[6-9]\d{9}$/.test(normalized);
}

export function formatWhatsappDisplay(normalized: string): string {
  if (normalized.length === 12 && normalized.startsWith("91")) {
    return `+91 ${normalized.slice(2, 7)} ${normalized.slice(7)}`;
  }
  return normalized;
}
