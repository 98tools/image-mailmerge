interface Env {
  ASSETS: {
    fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
  };
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Access-Control-Max-Age": "86400",
};

const PROXY_ENDPOINT = "/corsproxy/";

function isCorsPreflightRequest(request: Request): boolean {
  return (
    request.headers.get("Origin") !== null &&
    request.headers.get("Access-Control-Request-Method") !== null &&
    request.headers.get("Access-Control-Request-Headers") !== null
  );
}

function handleOptions(request: Request): Response {
  if (isCorsPreflightRequest(request)) {
    const requestHeaders = request.headers.get("Access-Control-Request-Headers") ?? "";
    return new Response(null, {
      headers: {
        ...CORS_HEADERS,
        "Access-Control-Allow-Headers": requestHeaders,
      },
    });
  }

  return new Response(null, {
    headers: {
      Allow: "GET, HEAD, POST, OPTIONS",
    },
  });
}

function isAllowedProxyMethod(method: string): boolean {
  return method === "GET" || method === "HEAD" || method === "POST";
}

function isCorsAssetPath(pathname: string): boolean {
  return pathname.startsWith("/assets/") || pathname.endsWith("/remoteEntry.js");
}

function withCorsHeaders(response: Response, request: Request, methods: string): Response {
  const origin = request.headers.get("Origin") ?? "*";
  const corsResponse = new Response(response.body, response);

  corsResponse.headers.set("Access-Control-Allow-Origin", origin);
  corsResponse.headers.set("Access-Control-Allow-Methods", methods);
  corsResponse.headers.set("Access-Control-Max-Age", CORS_HEADERS["Access-Control-Max-Age"]);
  corsResponse.headers.append("Vary", "Origin");

  return corsResponse;
}

async function handleProxyRequest(request: Request): Promise<Response> {
  const requestUrl = new URL(request.url);
  let apiUrl = requestUrl.searchParams.get("apiurl");

  if (!apiUrl) {
    return new Response("Missing required query parameter: apiurl", { status: 400 });
  }

  let parsedApiUrl: URL;
  try {
    parsedApiUrl = new URL(apiUrl);
  } catch {
    return new Response("Invalid apiurl", { status: 400 });
  }

  if (!(parsedApiUrl.protocol === "https:" || parsedApiUrl.protocol === "http:")) {
    return new Response("Only http and https protocols are supported", { status: 400 });
  }

  // Rewrite request to remote API and set Origin so upstream sees a same-origin request.
  const upstreamRequest = new Request(parsedApiUrl.toString(), request);
  upstreamRequest.headers.set("Origin", parsedApiUrl.origin);

  const upstreamResponse = await fetch(upstreamRequest);
  return withCorsHeaders(upstreamResponse, request, CORS_HEADERS["Access-Control-Allow-Methods"]);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith(PROXY_ENDPOINT)) {
      if (request.method === "OPTIONS") {
        return handleOptions(request);
      }

      if (!isAllowedProxyMethod(request.method)) {
        return new Response(null, {
          status: 405,
          statusText: "Method Not Allowed",
        });
      }

      return handleProxyRequest(request);
    }

    if (request.method === "OPTIONS" && isCorsAssetPath(url.pathname)) {
      return handleOptions(request);
    }

    const assetResponse = await env.ASSETS.fetch(request);

    if (isCorsAssetPath(url.pathname)) {
      return withCorsHeaders(assetResponse, request, "GET,HEAD,OPTIONS");
    }

    return assetResponse;
  },
};
