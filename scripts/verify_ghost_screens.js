// scripts/verify_ghost_screens.js
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = path.resolve('C:/Users/raizi/.gemini/antigravity-ide/brain/a4dedc86-fe2a-4280-9d31-cac4d791ae47');

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // 1. PCビュー (1280x800)
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:8898/ghost/index.html', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ghost_pc_title.png') });
  console.log('Saved ghost_pc_title.png');

  // タイトルの文言確認
  const titleInfo = await page.$eval('#title-loop-info', el => el.textContent);
  console.log('Title info text:', titleInfo);

  // ゲーム開始クリック
  await page.click('#btn-start-game');
  await new Promise(r => setTimeout(r, 800));

  // プロローグ会話が表示されている状態（立ち絵・心の声・波形の検証）
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ghost_pc_dialogue.png') });
  console.log('Saved ghost_pc_dialogue.png');

  // スキップで会話を抜けて探索画面へ進む
  await page.click('#btn-dialogue-skip');
  await new Promise(r => setTimeout(r, 2000));

  // 探索画面（アリア自室・未調査バッジ・立証ガード）
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ghost_pc_explore_desk.png') });
  console.log('Saved ghost_pc_explore_desk.png');

  // エリア切替: NCOモニター
  await page.click('#btn-area-living');
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ghost_pc_explore_nco.png') });
  console.log('Saved ghost_pc_explore_nco.png');

  // 2. スマホビュー (375x667 iPhone SE)
  await page.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:8898/ghost/index.html', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ghost_mobile_title.png') });
  console.log('Saved ghost_mobile_title.png');

  // スマホでスタート
  await page.click('#btn-start-game');
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ghost_mobile_dialogue.png') });
  console.log('Saved ghost_mobile_dialogue.png');

  // スキップで探索画面へ
  await page.click('#btn-dialogue-skip');
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ghost_mobile_explore.png') });
  console.log('Saved ghost_mobile_explore.png');

  await browser.close();
  console.log('All verification screenshots captured successfully!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
