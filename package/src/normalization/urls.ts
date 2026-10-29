export function validHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return /^https?:$/.test(url.protocol) && !url.username && !url.password && value === value.trim() && !/[\u0000-\u0020\u007f]/u.test(value);
  } catch { return false; }
}
export function canonicalUrl(value: string, base?: string): string | undefined {
  try {
    const url = new URL(value, base);
    if (!/^https?:$/.test(url.protocol)) return undefined;
    url.hash = '';
    url.pathname = url.pathname.replace(/\/+$/, '') || '/';
    return url.href;
  } catch { return undefined; }
}
export function relativeKey(value: string, base: string): string | undefined {
  const canonical = canonicalUrl(value, base);
  if (!canonical) return undefined;
  const url = new URL(canonical);
  return url.pathname + url.search;
}
