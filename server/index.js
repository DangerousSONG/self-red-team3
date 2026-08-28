function assetRequest(request, pathname) {
  const url = new URL(request.url);
  url.pathname = pathname;
  url.search = "";
  return new Request(url.toString(), request);
}

function withHeaders(response) {
  const headers = new Headers(response.headers);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  if (!headers.has("Cache-Control")) headers.set("Cache-Control", "no-store");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request, env) {
    const method = request.method.toUpperCase();
    if (method !== "GET" && method !== "HEAD") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    let pathname;
    try {
      pathname = decodeURIComponent(new URL(request.url).pathname);
    } catch {
      return new Response("Bad Request", { status: 400 });
    }

    if (!pathname || pathname === "/") pathname = "/index.html";

    let response = await env.ASSETS.fetch(assetRequest(request, pathname));
    const lastPart = pathname.split("/").pop() || "";
    if (response.status === 404 && !lastPart.includes(".")) {
      response = await env.ASSETS.fetch(assetRequest(request, "/index.html"));
    }

    return withHeaders(response);
  },
};
