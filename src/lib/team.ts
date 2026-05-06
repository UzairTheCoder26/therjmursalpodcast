export function initialsFromName(name: string) {
  const cleaned = name.trim();
  if (!cleaned) return "?";
  const parts = cleaned.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = (parts.length > 1 ? parts[parts.length - 1]?.[0] : "") ?? "";
  const initials = (first + last).toUpperCase();
  return initials || "?";
}

export function normalizeInstagramHandle(handle: string) {
  const h = (handle || "").trim();
  if (!h) return "";
  if (h.startsWith("@")) return h.slice(1);
  // If user pastes a URL, try to extract the last path segment
  try {
    if (h.startsWith("http://") || h.startsWith("https://")) {
      const u = new URL(h);
      const seg = u.pathname.split("/").filter(Boolean).pop() || "";
      return seg.replace(/^@/, "");
    }
  } catch {
    // ignore
  }
  return h.replace(/^@/, "");
}

export function instagramUrl(handle: string) {
  const h = normalizeInstagramHandle(handle);
  return h ? `https://instagram.com/${h}` : "";
}

