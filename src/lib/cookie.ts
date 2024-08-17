export function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  cookieHeader.split(';').forEach((cookie) => {
    const [name, value] = cookie.split('=').map((c) => c.trim());
    if (name && value) {
      cookies[name] = decodeURIComponent(value);
    }
  });

  return cookies;
}

export function getCookie(header: string, key: string): string {
  if (!header) {
    return header;
  }
  const parsedCookie = parseCookies(header);
  return parsedCookie[key];
}
