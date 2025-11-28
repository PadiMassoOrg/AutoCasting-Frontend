export type AutocastingJwtPayload = {
  sub: string;
  roles?: string[];
  role?: string;
  publicSlug?: string;
  exp?: number;
  iat?: number;
  iss?: string;
};

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  return atob(padded);
}

export function jwtDecoder(token: string): AutocastingJwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;

    const payloadPart = parts[1];
    const json = base64UrlDecode(payloadPart);
    return JSON.parse(json) as AutocastingJwtPayload;
  } catch {
    return null;
  }
}
