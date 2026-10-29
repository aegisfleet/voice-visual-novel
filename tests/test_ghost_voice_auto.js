// tests/test_ghost_voice_auto.js - AUTO機能＆再生速度制御の検証テスト
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const puppeteer = require('puppeteer');

const ROOT_DIR = path.resolve(__dirname, '..');

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
  ];
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) return p;
  }
  return undefined;
}

async function runTest() {
  console.log('🚀 GHOST 音声AUTO＆再生速度テストを開始します...');
  const server = createStaticServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/ghost/`;

  let browser = null;
  try {
    const launchOptions = {
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'],
    };
    const execPath = getChromePath();
    if (execPath) launchOptions.executablePath = execPath;

    browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // 1. PCビューでのテスト (1280x720)
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 600));

    // ゲーム開始
    console.log('1. ゲーム開始ボタンをクリック');
    await page.click('#btn-start-game');
    await new Promise((r) => setTimeout(r, 600));

    // AUTOが有効になっているか確認
    const autoActive = await page.evaluate(() => {
      const btn = document.getElementById('btn-dialogue-auto');
      return {
        hasActiveClass: btn.classList.contains('active'),
        appIsAutoActive: window.ghostApp?.isAutoActive,
      };
    });
    console.log('AUTO状態判定:', autoActive);
    if (!autoActive.hasActiveClass || !autoActive.appIsAutoActive) {
      throw new Error(`AUTOが初期有効になっていません: ${JSON.stringify(autoActive)}`);
    }

    // 速度ボタンの表示と切り替え確認
    console.log('2. 速度切り替えボタンのクリック検証');
    const speedBtnText1 = await page.$eval('#btn-dialogue-speed', (el) => el.textContent.trim());
    console.log('初期速度表示:', speedBtnText1);
    if (speedBtnText1 !== '1.0x') {
      throw new Error(`初期速度が1.0xではありません: ${speedBtnText1}`);
    }

    // クリック1回: 1.25x
    await page.click('#btn-dialogue-speed');
    const speed2 = await page.evaluate(() => ({
      btnText: document.getElementById('btn-dialogue-speed').textContent.trim(),
      audioSpeed: window.ghostApp.audio.voiceSpeed,
    }));
    console.log('1回クリック後 (1.25x):', speed2);
    if (speed2.btnText !== '1.25x' || speed2.audioSpeed !== 1.25) {
      throw new Error(`1.25xへの切り替え失敗: ${JSON.stringify(speed2)}`);
    }

    // クリック2回: 1.5x
    await page.click('#btn-dialogue-speed');
    const speed3 = await page.evaluate(() => ({
      btnText: document.getElementById('btn-dialogue-speed').textContent.trim(),
      audioSpeed: window.ghostApp.audio.voiceSpeed,
    }));
    console.log('2回クリック後 (1.5x):', speed3);
    if (speed3.btnText !== '1.5x' || speed3.audioSpeed !== 1.5) {
      throw new Error(`1.5xへの切り替え失敗: ${JSON.stringify(speed3)}`);
    }

    // クリック3回: 2.0x
    await page.click('#btn-dialogue-speed');
    const speed4 = await page.evaluate(() => ({
      btnText: document.getElementById('btn-dialogue-speed').textContent.trim(),
      audioSpeed: window.ghostApp.audio.voiceSpeed,
    }));
    console.log('3回クリック後 (2.0x):', speed4);
    if (speed4.btnText !== '2.0x' || speed4.audioSpeed !== 2.0) {
      throw new Error(`2.0xへの切り替え失敗: ${JSON.stringify(speed4)}`);
    }

    // クリック4回: 1.0x に戻る
    await page.click('#btn-dialogue-speed');
    const speed1Again = await page.evaluate(() => ({
      btnText: document.getElementById('btn-dialogue-speed').textContent.trim(),
      audioSpeed: window.ghostApp.audio.voiceSpeed,
    }));
    console.log('4回クリック後 (1.0x復帰):', speed1Again);
    if (speed1Again.btnText !== '1.0x' || speed1Again.audioSpeed !== 1.0) {
      throw new Error(`1.0xへの復帰失敗: ${JSON.stringify(speed1Again)}`);
    }

    // 設定モーダルの検証
    console.log('3. 設定モーダルの速度変更検証');
    await page.click('#btn-hud-settings');
    await new Promise((r) => setTimeout(r, 400));

    // 1.5x ボタンをクリック
    await page.evaluate(() => {
      const btn = document.querySelector('.btn-speed-option[data-speed="1.5"]');
      btn.click();
    });
    const settingsSpeed = await page.evaluate(() => ({
      valText: document.getElementById('settings-speed-val').textContent.trim(),
      hudBtnText: document.getElementById('btn-dialogue-speed').textContent.trim(),
      audioSpeed: window.ghostApp.audio.voiceSpeed,
    }));
    console.log('設定モーダルでの1.5x指定後:', settingsSpeed);
    if (settingsSpeed.valText !== '1.5x' || settingsSpeed.audioSpeed !== 1.5 || settingsSpeed.hudBtnText !== '1.5x') {
      throw new Error(`設定モーダルからの速度変更失敗: ${JSON.stringify(settingsSpeed)}`);
    }

    // 設定モーダルを閉じる
    await page.click('#btn-close-settings');
    await new Promise((r) => setTimeout(r, 400));

    // PC画面キャプチャ保存
    const outDir = 'C:\\Users\\raizi\\.gemini\\antigravity\\brain\\3eafd1a5-bdd4-4e5b-a845-8f42a7fe5c00';
    await page.screenshot({ path: path.join(outDir, 'ghost_auto_speed_pc.png') });
    console.log('📷 PCキャプチャ保存完了: ghost_auto_speed_pc.png');

    // 4. スマホビューでのテスト (375x667)
    console.log('4. スマホビュー検証 (375x667)');
    const mobilePage = await browser.newPage();
    await mobilePage.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });
    await mobilePage.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 600));

    // タイトル画面でRESUMEまたはSTARTをクリック
    await mobilePage.evaluate(() => {
      const resumeBtn = document.getElementById('btn-continue-game');
      if (resumeBtn && !resumeBtn.classList.contains('hidden')) {
        resumeBtn.click();
      } else {
        document.getElementById('btn-start-game').click();
      }
    });
    await new Promise((r) => setTimeout(r, 600));

    await mobilePage.screenshot({ path: path.join(outDir, 'ghost_auto_speed_mobile.png') });
    console.log('📷 スマホノベル画面キャプチャ保存完了: ghost_auto_speed_mobile.png');

    // スマホ設定モーダルも確認
    await mobilePage.click('#btn-hud-settings');
    await new Promise((r) => setTimeout(r, 400));
    await mobilePage.screenshot({ path: path.join(outDir, 'ghost_auto_speed_modal_mobile.png') });
    console.log('📷 スマホ設定モーダルキャプチャ保存完了: ghost_auto_speed_modal_mobile.png');
    await mobilePage.close();

    // 5. 音声再生中のAUTO待機検証
    console.log('5. 音声再生中のAUTO待機ロジック検証');
    const autoWaitVerification = await page.evaluate(async () => {
      const app = window.ghostApp;
      // 強制的にタイピングを完了状態にし、isVoicePlaying = true をシミュレート
      app.isTyping = false;
      app.isVoicePlaying = true;
      app.checkAutoAdvance();
      // タイマーがセットされていないことを確認（autoTimer が null）
      const timerBlockedWhilePlaying = app.autoTimer === null;

      // 音声再生完了コールバックをシミュレート
      app.handleVoicePlaybackEnd();
      const isVoicePlayingAfterEnd = app.isVoicePlaying;
      const timerScheduledAfterEnd = app.autoTimer !== null;

      return {
        timerBlockedWhilePlaying,
        isVoicePlayingAfterEnd,
        timerScheduledAfterEnd,
      };
    });
    console.log('AUTO待機検証結果:', autoWaitVerification);
    if (!autoWaitVerification.timerBlockedWhilePlaying) {
      throw new Error('音声再生中にautoTimerがスケジュールされてしまっています！');
    }
    if (autoWaitVerification.isVoicePlayingAfterEnd || !autoWaitVerification.timerScheduledAfterEnd) {
      throw new Error('音声再生終了後に正しくautoTimerがスケジュールされませんでした！');
    }

    console.log('✅ 全検証ステップに成功しました！');
    if (consoleErrors.length > 0) {
      console.warn('⚠️ コンソールエラーが発生しています:', consoleErrors);
    } else {
      console.log('✅ コンソールエラー 0件');
    }
  } finally {
    if (browser) await browser.close();
    server.close();
  }
}

runTest().catch((err) => {
  console.error('❌ テスト失敗:', err);
  process.exit(1);
});
