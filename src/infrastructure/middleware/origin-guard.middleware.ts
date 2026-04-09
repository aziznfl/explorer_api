import type { Context, Next } from 'hono';

/**
 * Middleware to restrict access to requests originating from a specific domain.
 * It checks both 'Origin' and 'Referer' headers.
 */
export const originGuardMiddleware = async (c: Context, next: Next) => {
  const origin = c.req.header('Origin');
  const referer = c.req.header('Referer');
  const targetDomain = 'aziznfl.my.id';

  const isAllowedHost = (urlStr?: string): boolean => {
    if (!urlStr) return false;
    try {
      const hostname = new URL(urlStr).hostname;
      return hostname === targetDomain || hostname.endsWith(`.${targetDomain}`);
    } catch {
      // In case of invalid URL format in headers
      return false;
    }
  };

  const allowedByOrigin = isAllowedHost(origin);
  const allowedByReferer = isAllowedHost(referer);

  // If neither Origin nor Referer matches the allowed domain, deny access
  if (!allowedByOrigin && !allowedByReferer) {
    return c.json(
      {
        meta: {
          message: 'Access Denied',
          status: 403,
        },
      },
      403
    );
  }

  await next();
};
