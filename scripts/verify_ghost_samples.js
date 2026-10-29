// scripts/verify_ghost_samples.js
const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8899;
const ROOT_DIR = path.resolve('.');
const ARTIFACT_DIR = path.resolve('C:/Users/raizi/.gemini/antigravity/brain/3eafd1a5-bdd4-4e5b-a845-8f42a7fe5c00');

// 簡易静的ファイルサーバー
function startServer() {
  const server = http.createServer((req, res) => {
    let reqPath = decodeURIComponent(req.url.split('?')[0]);
    if (reqPath === '/') reqPath = '/ghost/index.html';
    const filePath = path.join(ROOT_DIR, reqPath);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not Found');
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.mp3': 'audio/mpeg',
        '.wav': 'audio/wav',
      };
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      res.end(data);
    });
  });

  return new Promise((resolve) => {
    server.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

async function run() {
  const server = await startServer();

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // 1. samples.html - PCビュー (1280x800)
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(`http://localhost:${PORT}/ghost/samples.html`, { waitUntil: 'networkidle0' });
  const sampleCardCount = await page.$$eval('.char-card', els => els.length);
  const audioCount = await page.$$eval('audio', els => els.length);
  console.log(`samples.html - PC: cards=${sampleCardCount}, audio=${audioCount}`);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ghost_samples_pc.png') });

  // 2. samples.html - スマホビュー (375x667)
  await page.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });
  await page.goto(`http://localhost:${PORT}/ghost/samples.html`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ghost_samples_mobile.png') });

  // 3. index.html - 設定資料モーダルを開く (PC 1280x800)
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(`http://localhost:${PORT}/ghost/index.html`, { waitUntil: 'networkidle0' });
  // 設定資料ボタンをクリック
  await page.click('#btn-open-gallery');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ghost_modal_gallery_pc.png') });

  // 4. index.html - 設定資料モーダル (スマホ 375x667)
  await page.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });
  await page.goto(`http://localhost:${PORT}/ghost/index.html`, { waitUntil: 'networkidle0' });
  await page.click('#btn-open-gallery');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ghost_modal_gallery_mobile.png') });

  await browser.close();
  server.close();
  console.log('All verification completed successfully!');
}

run().catch(err => {
  console.error('Error in verification:', err);
  process.exit(1);
});

