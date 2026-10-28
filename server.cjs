const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const types = new Map(JSON.parse(fs.readFileSync(path.join(root, 'mirror-report.json'))).files.map(f => [f.path, f.type]));
const server = http.createServer((req, res) => {
  let name;
  try { name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400); return res.end(); }
  if (name.endsWith('/')) name += 'index.html';
  const file = path.resolve(root, '.' + name);
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404); return res.end('Not found');
  }
  const size = fs.statSync(file).size;
  res.writeHead(200, {'Content-Type': types.get(name) || ({'.html':'text/html; charset=utf-8','.js':'application/javascript','.woff2':'font/woff2','.json':'application/json','.pdf':'application/pdf','.png':'image/png','.ico':'image/x-icon'}[path.extname(file)] || 'application/octet-stream'), 'Content-Length':size});
  if (req.method === 'HEAD') return res.end();
  fs.createReadStream(file).pipe(res);
});
server.listen(4173, '127.0.0.1', () => console.log('Portfolio running at http://localhost:4173'));
server.on('error', e => { console.error(e.message); process.exit(1); });
