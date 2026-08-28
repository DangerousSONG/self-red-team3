"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const serverDir = path.join(dist, "server");
const hostingDir = path.join(dist, ".openai");
const staticFiles = ["index.html", "styles.css", "data.js", "pages.js", "app.js", "THIRD_PARTY_NOTICES.md"];
const staticDirs = ["dashboard"];

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

const textRoutes = {
  "/index.html": { type: "text/html; charset=utf-8", file: "index.html" },
  "/styles.css": { type: "text/css; charset=utf-8", file: "styles.css" },
  "/data.js": { type: "text/javascript; charset=utf-8", file: "data.js" },
  "/pages.js": { type: "text/javascript; charset=utf-8", file: "pages.js" },
  "/app.js": { type: "text/javascript; charset=utf-8", file: "app.js" },
  "/dashboard/index.html": { type: "text/html; charset=utf-8", file: "dashboard/index.html" },
  "/dashboard/styles.css": { type: "text/css; charset=utf-8", file: "dashboard/styles.css" },
  "/dashboard/script.js": { type: "text/javascript; charset=utf-8", file: "dashboard/script.js" },
};

const binaryRoutes = {
  "/dashboard/assets/scene-map.png": { type: "image/png", file: "dashboard/assets/scene-map.png" },
};

const embeddedText = Object.fromEntries(Object.entries(textRoutes).map(([route, asset]) => [
  route,
  { type: asset.type, body: fs.readFileSync(path.join(root, asset.file), "utf8") },
]));
const embeddedBinary = Object.fromEntries(Object.entries(binaryRoutes).map(([route, asset]) => [
  route,
  { type: asset.type, body: fs.readFileSync(path.join(root, asset.file)).toString("base64") },
]));

const worker = `const textAssets = ${JSON.stringify(embeddedText)};
const binaryAssets = ${JSON.stringify(embeddedBinary)};

function securityHeaders(type) {
  return {
    "Content-Type": type,
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  };
}

function base64ToBytes(value) {
  const raw = atob(value);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

export default {
  async fetch(request) {
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
    if (pathname.endsWith("/")) pathname += "index.html";

    const textAsset = textAssets[pathname];
    if (textAsset) return new Response(method === "HEAD" ? null : textAsset.body, { headers: securityHeaders(textAsset.type) });

    const binaryAsset = binaryAssets[pathname];
    if (binaryAsset) return new Response(method === "HEAD" ? null : base64ToBytes(binaryAsset.body), { headers: securityHeaders(binaryAsset.type) });

    const lastPart = pathname.split("/").pop() || "";
    if (!lastPart.includes(".")) {
      const fallback = textAssets["/index.html"];
      return new Response(method === "HEAD" ? null : fallback.body, { headers: securityHeaders(fallback.type) });
    }

    return new Response("Not Found", { status: 404, headers: securityHeaders("text/plain; charset=utf-8") });
  },
};
`;
fs.writeFileSync(path.join(serverDir, "index.js"), worker, "utf8");
