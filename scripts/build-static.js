"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const serverDir = path.join(dist, "server");
const hostingDir = path.join(dist, ".openai");
const staticFiles = ["index.html", "styles.css", "data.js", "pages.js", "app.js", "THIRD_PARTY_NOTICES.md"];
const staticDirs = ["dashboard"];

const worker = `function assetRequest(request, pathname) {
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
`;

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(serverDir, { recursive: true });
fs.mkdirSync(hostingDir, { recursive: true });

function copyDir(source, destination) {
  fs.mkdirSync(destination, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);
    if (entry.isDirectory()) {
      copyDir(sourcePath, destinationPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(sourcePath, destinationPath);
    }
  }
}

for (const file of staticFiles) {
  const source = path.join(root, file);
  if (fs.existsSync(source)) fs.copyFileSync(source, path.join(dist, file));
}

for (const dir of staticDirs) {
  const source = path.join(root, dir);
  if (fs.existsSync(source)) copyDir(source, path.join(dist, dir));
}

fs.copyFileSync(path.join(root, ".openai", "hosting.json"), path.join(hostingDir, "hosting.json"));
fs.writeFileSync(path.join(serverDir, "index.js"), worker, "utf8");
