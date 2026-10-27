// tests/test_ghost_e2e.js - GHOST PROTOCOL E2E 自動検証テスト (Puppeteer)
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const puppeteer = require('puppeteer');

const ROOT_DIR = path.resolve(__dirname, '..');

// 簡易静的ファイルサーバー
function createStaticServer() {
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.svg': 'image/svg+xml',
  };

  return http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

    const filePath = path.join(ROOT_DIR, reqPath);
    if (!fs.existsSync(filePath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }

    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      const indexFile = path.join(filePath, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        fs.createReadStream(indexFile).pipe(res);
        return;
      }
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Directory listing forbidden');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
}

function getChromePath() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }
  const candidatePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ];
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) return p;
  }
  return undefined;
}

async function runE2ETest() {
  console.log('🚀 GHOST PROTOCOL E2E テストを開始します...');
  const server = createStaticServer();

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/ghost/`;
  console.log(`📡 テスト用ローカルサーバー稼働中: ${baseUrl}`);

  let browser = null;
  try {
    const executablePath = getChromePath();
    const launchOptions = {
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    };
    if (executablePath) {
      launchOptions.executablePath = executablePath;
    }

    browser = await puppeteer.launch(launchOptions);

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    // コンソールエラー監視
    const pageErrors = [];
    page.on('pageerror', (err) => {
      console.error('⚠️ ブラウザページエラー:', err.message);
      pageErrors.push(err.message);
    });

    console.log('1️⃣ ページ読み込み検証...');
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#screen-title.active', { timeout: 5000 });

    // Test 1: タイトル画面表示検証
    console.log('2️⃣ タイトル画面とキービジュアル全景の検証...');
    const titleState = await page.evaluate(() => {
      const screenTitle = document.getElementById('screen-title');
      const screenNovel = document.getElementById('screen-novel');
      const hud = document.getElementById('hud');
      const heroWrap = document.querySelector('.title-hero-wrap');
      const heroImg = document.querySelector('.title-hero-img');

      const titleStyle = window.getComputedStyle(screenTitle);
      const novelStyle = window.getComputedStyle(screenNovel);
      const hudStyle = window.getComputedStyle(hud);

      return {
        isTitleVisible: titleStyle.display !== 'none',
        isNovelHidden: novelStyle.display === 'none',
        isHudHidden: hudStyle.display === 'none',
        heroWrapRect: heroWrap ? heroWrap.getBoundingClientRect() : null,
        heroImgNaturalWidth: heroImg ? heroImg.naturalWidth : 0,
        heroImgNaturalHeight: heroImg ? heroImg.naturalHeight : 0,
      };
    });

    if (!titleState.isTitleVisible) {
      throw new Error('初期表示で #screen-title が表示されていません。');
    }
    if (!titleState.isNovelHidden) {
      throw new Error('初期表示で #screen-novel が非表示になっていません。');
    }
    if (!titleState.isHudHidden) {
      throw new Error('初期表示で #hud が非表示になっていません。');
    }
    if (titleState.heroImgNaturalWidth === 0) {
      throw new Error('キービジュアル画像が読み込まれていません。');
    }
    console.log('   ✅ タイトル画面とキービジュアル正常確認');

    // Test 2: タイトル画面の音響設定モーダル開閉
    console.log('3️⃣ タイトル音響設定モーダル開閉の検証...');
    await page.click('#btn-title-settings');
    await page.waitForFunction(() => {
      const modal = document.getElementById('modal-settings');
      return modal && !modal.classList.contains('hidden');
    });

    // スライダー存在確認
    const sliderCount = await page.$$eval('.cyber-slider', (els) => els.length);
    if (sliderCount < 3) {
      throw new Error(`音響スライダーが不足しています (検出数: ${sliderCount})`);
    }

    // 閉じるボタンクリック
    await page.click('#btn-close-settings');
    await page.waitForFunction(() => {
      const modal = document.getElementById('modal-settings');
      return modal && modal.classList.contains('hidden');
    });
    console.log('   ✅ 音響設定モーダル開閉正常確認');

    // Test 3: ゲーム開始ボタン押下時の画面遷移
    console.log('4️⃣ ゲーム開始ボタン押下と画面遷移の検証...');
    await page.click('#btn-start-game');

    // ノベル画面が active になり、タイトル画面が非表示になること
    await page.waitForFunction(() => {
      const title = document.getElementById('screen-title');
      const novel = document.getElementById('screen-novel');
      const hud = document.getElementById('hud');
      if (!title || !novel || !hud) return false;

      const titleDisplay = window.getComputedStyle(title).display;
      const novelDisplay = window.getComputedStyle(novel).display;
      const hudDisplay = window.getComputedStyle(hud).display;

      return (
        titleDisplay === 'none' &&
        novelDisplay !== 'none' &&
        hudDisplay !== 'none' &&
        novel.classList.contains('active')
      );
    }, { timeout: 5000 });

    console.log('   ✅ ゲーム開始画面遷移（#screen-title 非表示 & #screen-novel 表示）正常確認');

    // Test 4: ノベル会話進行の検証
    console.log('5️⃣ ノベル会話テキスト進行の検証...');
    await page.waitForSelector('#dialogue-text', { timeout: 5000 });
    const textFirst = await page.$eval('#dialogue-text', (el) => el.textContent.trim());

    // 画面タップでセリフ進行
    await page.click('#novel-window');
    await new Promise((r) => setTimeout(r, 400));
    await page.click('#novel-window');
    await new Promise((r) => setTimeout(r, 400));

    const textSecond = await page.$eval('#dialogue-text', (el) => el.textContent.trim());
    console.log(`   ・初回テキスト: "${textFirst.slice(0, 20)}..."`);
    console.log(`   ・進行後テキスト: "${textSecond.slice(0, 20)}..."`);

    // Test 5: インゲームHUDからの設定モーダル開閉
    console.log('6️⃣ インゲームHUDからの設定モーダル開閉検証...');
    await page.click('#btn-hud-settings');
    await page.waitForFunction(() => {
      const modal = document.getElementById('modal-settings');
      return modal && !modal.classList.contains('hidden');
    });
    await page.click('#btn-confirm-settings');
    await page.waitForFunction(() => {
      const modal = document.getElementById('modal-settings');
      return modal && modal.classList.contains('hidden');
    });
    console.log('   ✅ インゲーム音響設定モーダル正常確認');

    // Test 6: タイトル画面へ戻る検証
    console.log('7️⃣ タイトル画面復帰の検証...');
    await page.click('#btn-hud-return-title');
    await page.waitForFunction(() => {
      const title = document.getElementById('screen-title');
      const novel = document.getElementById('screen-novel');
      const hud = document.getElementById('hud');
      return (
        window.getComputedStyle(title).display !== 'none' &&
        window.getComputedStyle(novel).display === 'none' &&
        window.getComputedStyle(hud).display === 'none'
      );
    }, { timeout: 5000 });
    console.log('   ✅ タイトル画面復帰正常確認');

    if (pageErrors.length > 0) {
      throw new Error(`ブラウザ実行時エラーが検出されました: ${pageErrors.join(', ')}`);
    }

    console.log('🎉 すべての E2E テスト項目をクリアしました！');
  } finally {
    if (browser) await browser.close();
    server.close();
  }
}

runE2ETest()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ E2E テスト失敗:', err);
    process.exit(1);
  });
