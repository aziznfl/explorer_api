import { Elysia } from 'elysia';

/**
 * Middleware to restrict access to requests originating from a specific domain.
 * It checks both 'Origin' and 'Referer' headers.
 */
export const originGuardMiddleware = new Elysia()
  .onBeforeHandle({ as: 'global' }, ({ request, set }) => {
    const origin = request.headers.get('Origin');
    const referer = request.headers.get('Referer');
    const targetDomain = 'aziznfl.my.id';

    const isAllowedHost = (urlStr?: string | null): boolean => {
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
      set.status = 403;
      return {
        meta: {
          message: 'Access Denied',
          status: 403,
        },
      };
    }
  });
