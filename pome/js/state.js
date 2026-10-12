// state.js - ゲーム状態と永続化（localStorage）の管理

class GameState {
  constructor() {
    this.STORAGE_KEY = 'vvn_pomeranian_save_v1';
    this.resetTransientState();
    this.loadPersistentState();
  }

  // 1プレイごとの一時状態の初期化
  resetTransientState() {
    this.currentPhase = 'TITLE'; // 'TITLE', 'PROLOGUE', 'EXPLORATION', 'DEBATE', 'ENDING'
    this.life = 3;               // 立証パートのライフ (最大3)
    this.currentDebateStep = 0;  // 立証パートの問答番号
    this.evidence = [];          // 所持している証拠IDリスト (['cotton', 'nuts', 'tree', 'ribbon'])
    this.examinedSpots = [];     // 調査済みスポットIDリスト
    this.endingType = null;      // 'BAD', 'HAPPY', 'TRUE'
  }

  // 永続セーブデータの読み込み
  loadPersistentState() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        this.clearCount = data.clearCount || 0;
        this.trueEndUnlocked = !!data.trueEndUnlocked;
        this.voiceEnabled = data.voiceEnabled !== undefined ? data.voiceEnabled : true;
        this.seEnabled = data.seEnabled !== undefined ? data.seEnabled : true;
        this.bgmEnabled = data.bgmEnabled !== undefined ? data.bgmEnabled : true;
      } else {
        this.clearCount = 0;
        this.trueEndUnlocked = false;
        this.voiceEnabled = true;
        this.seEnabled = true;
        this.bgmEnabled = true;
      }
    } catch (e) {
      console.warn('Failed to load save data:', e);
      this.clearCount = 0;
      this.trueEndUnlocked = false;
      this.voiceEnabled = true;
      this.seEnabled = true;
      this.bgmEnabled = true;
    }
  }

  // 永続セーブデータの保存
  savePersistentState() {
    try {
      const data = {
        clearCount: this.clearCount,
        trueEndUnlocked: this.trueEndUnlocked,
        voiceEnabled: this.voiceEnabled,
        seEnabled: this.seEnabled,
        bgmEnabled: this.bgmEnabled
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save data:', e);
    }
  }

  // 2周目以降かどうかの判定 (1回以上通常クリア済み)
  isSecondLoopOrLater() {
    return this.clearCount >= 1;
  }

  // 証拠を獲得したか
  hasEvidence(id) {
    return this.evidence.includes(id);
  }

  // 証拠の追加
  addEvidence(id) {
    if (!this.hasEvidence(id)) {
      this.evidence.push(id);
      return true;
    }
    return false;
  }

  // スポット調査済みの記録
  markSpotExamined(id) {
    if (!this.examinedSpots.includes(id)) {
      this.examinedSpots.push(id);
    }
  }

  isSpotExamined(id) {
    return this.examinedSpots.includes(id);
  }

  // 必要な証拠が揃ったか判定
  // 通常：cotton, nuts, tree の3つ
  // 2周目でTRUE ENDを目指す場合：さらに ribbon が必要
  isReadyForDebate() {
    const basicReady = this.hasEvidence('cotton') && this.hasEvidence('nuts') && this.hasEvidence('tree');
    return basicReady;
  }

  // クリア記録
  recordClear(endingType) {
    if (endingType === 'HAPPY') {
      if (this.clearCount === 0) {
        this.clearCount = 1;
      } else {
        this.clearCount++;
      }
    } else if (endingType === 'TRUE') {
      this.clearCount++;
      this.trueEndUnlocked = true;
    }
    this.savePersistentState();
  }

  // 完全リセット（最初からやり直したい時）
  resetAllData() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.loadPersistentState();
    this.resetTransientState();
  }
}

window.gameState = new GameState();
