import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
const allowed = new Map([['/pages/', ['index.html', 'text/html']], ['/pages/main.js', ['main.js', 'text/javascript']], ['/pages/course.js', ['course.js', 'text/javascript']], ['/pages/styles.css', ['styles.css', 'text/css']]]);
createServer(async (req, res) => {
  const file = allowed.get(req.url);
  if (!file) { res.writeHead(404).end(); return; }
  try { res.setHeader('Content-Type', `${file[1]}; charset=utf-8`); res.end(await readFile(new URL(`../out/pages/${file[0]}`, import.meta.url))); }
  catch { res.writeHead(500).end(); }
}).listen(5190, '127.0.0.1', () => console.log('http://127.0.0.1:5190/pages/'));
