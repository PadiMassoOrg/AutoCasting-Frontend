import { copyToClipboardGraceful, isBrowser } from './domUtils';

type ShareParams = {
  title?: string;
  url: string;
  onCopied?: () => void;
  onError?: () => void;
};

export async function shareUrl({ title, url, onCopied, onError }: ShareParams) {
  if (!isBrowser) return false;
  try {
    if (navigator.share) {
      await navigator.share({ title, url });
      return true;
    }
    const ok = await copyToClipboardGraceful(url);
    ok ? onCopied?.() : onError?.();
    return ok;
  } catch {
    return false;
  }
}
