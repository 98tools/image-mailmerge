interface Env {
  ASSETS: {
    fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
  };
  VITE_ALLOWED_ORIGINS?: string;
}

const DEFAULT_ALLOWED_ORIGINS = 'https://98tools.com';

function parseAllowedOrigins(raw: string | undefined): string[] {
  const source = raw && raw.trim().length > 0 ? raw : DEFAULT_ALLOWED_ORIGINS;
  return source
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function normalizeRequestOrigin(value: string | null): string | null {
  if (!value) {
    return null;
  }

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function patternToRegex(pattern: string): RegExp {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  const wildcardRegex = escaped.replace(/\*/g, '.*');
  return new RegExp(`^${wildcardRegex}$`);
}

function isOriginAllowed(origin: string, allowedOrigins: string[]): boolean {
  return allowedOrigins.some((pattern) => {
    if (pattern === '*') {
      return true;
    }

    if (pattern.includes('*')) {
      return patternToRegex(pattern).test(origin);
    }

    return origin === pattern;
  });
}

function applyCorsHeaders(response: Response, origin: string): Response {
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', origin);
  headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  headers.set('Access-Control-Allow-Headers', '*');
  headers.set('Access-Control-Max-Age', '86400');
  headers.set('Cross-Origin-Resource-Policy', 'cross-origin');
  headers.set('Vary', 'Origin');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const isAssetsRequest = url.pathname.startsWith('/assets/');

    if (!isAssetsRequest) {
      return env.ASSETS.fetch(request);
    }

    const origin = normalizeRequestOrigin(request.headers.get('Origin'));
    const allowedOrigins = parseAllowedOrigins(env.VITE_ALLOWED_ORIGINS);
    const originAllowed = origin ? isOriginAllowed(origin, allowedOrigins) : false;

    if (request.method === 'OPTIONS') {
      if (!origin || !originAllowed) {
        return new Response(null, { status: 403 });
      }

      return applyCorsHeaders(new Response(null, { status: 204 }), origin);
    }

    const response = await env.ASSETS.fetch(request);

    if (!origin || !originAllowed) {
      return response;
    }

    return applyCorsHeaders(response, origin);
  },
};