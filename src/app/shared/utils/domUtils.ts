export const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

export async function copyToClipboardGraceful(text: string): Promise<boolean> {
  try {
    if (isBrowser && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Blank on purpose
    /* noop */
  }

  if (!isBrowser) return false;
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', 'true');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}
