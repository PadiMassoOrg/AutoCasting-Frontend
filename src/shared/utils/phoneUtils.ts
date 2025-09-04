export function normalizePhone(raw?: string | null): string | null {
  if (!raw) return null;
  let p = raw.trim().replace(/[^\d+]/g, '');
  if (p.startsWith('00')) p = '+' + p.slice(2);
  if (!p) return null;
  // E.164-ish: + seguido de dígitos
  if (!/^\+\d{6,15}$/.test(p)) return null;
  return p;
}

export function whatsappLink(phone: string, text: string) {
  const norm = normalizePhone(phone);
  if (!norm) return null;
  const num = norm.slice(1); // sin '+'
  return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
}
