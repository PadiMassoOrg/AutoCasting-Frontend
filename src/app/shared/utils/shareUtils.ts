import { copyToClipboardGraceful, isBrowser } from './domUtils';

type ShareParams = {
  url: string;
  onCopied?: () => void;
  onError?: () => void;
};

export async function shareUrl({ url, onCopied, onError }: ShareParams) {
  if (!isBrowser) return false;
  try {
    const ok = await copyToClipboardGraceful(url);
    ok ? onCopied?.() : onError?.();
    return ok;
  } catch {
    return false;
  }
}
