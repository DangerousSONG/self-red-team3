"use strict";

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const host = process.env.RANGE_HOST || "127.0.0.1";
const port = Number(process.env.RANGE_PORT || 7180);
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

function resolveRequestPath(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, `http://${host}:${port}`).pathname);
  const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const candidate = path.resolve(root, relativePath);
  if (candidate !== root && !candidate.startsWith(`${root}${path.sep}`)) return null;
  return candidate;
}

const server = http.createServer((request, response) => {
  let filePath;
  try {
    filePath = resolveRequestPath(request.url || "/");
  } catch {
    response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Bad Request");
    return;
  }

  if (!filePath) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, file) => {
    if (!error) {
      response.writeHead(200, {
        "Content-Type": mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream",
        "Cache-Control": "no-store",
      });
      response.end(file);
      return;
    }

    if (!path.extname(filePath)) {
      fs.readFile(path.join(root, "index.html"), (fallbackError, html) => {
        if (fallbackError) {
          response.writeHead(404);
          response.end("Not Found");
          return;
        }
        response.writeHead(200, { "Content-Type": mimeTypes[".html"] });
        response.end(html);
      });
      return;
    }

    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not Found");
  });
});

server.on("error", (error) => {
  console.error(`Local server failed: ${error.message}`);
  process.exitCode = 1;
});

server.listen(port, host, () => {
  console.log(`CYBERSEC RANGE local → http://${host}:${port}/`);
});
