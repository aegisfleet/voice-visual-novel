// state.js - ゲーム状態と永続化（localStorage）の管理

class GameState {
  constructor() {
    this.STORAGE_KEY = 'vvn_pomeranian_save_v2';
    this.resetTransientState();
    this.loadPersistentState();
  }

  // 1プレイごとの一時状態の初期化
  resetTransientState() {
    this.currentPhase = 'TITLE'; // 'TITLE', 'PROLOGUE', 'EXPLORATION', 'DEBATE', 'ENDING'
    this.life = 3; // 立証パートのライフ (最大3)
    this.currentDebateStep = 0; // 立証パートの問答番号
    this.evidence = []; // 所持している証拠IDリスト
    this.examinedSpots = []; // 調査済みスポット・NPCリスト
    this.endingType = null; // 'BAD', 'HAPPY', 'TRUE'
  }

  applyDefaultPersistentState() {
    this.clearCount = 0;
    this.trueEndUnlocked = false;
    this.voiceEnabled = true;
    this.seEnabled = true;
    this.bgmEnabled = true;
  }

  applySavedPersistentState(data) {
    this.clearCount = data.clearCount || 0;
    this.trueEndUnlocked = Boolean(data.trueEndUnlocked);
    this.voiceEnabled = data.voiceEnabled ?? true;
    this.seEnabled = data.seEnabled ?? true;
    this.bgmEnabled = data.bgmEnabled ?? true;
  }

  // 永続セーブデータの読み込み
  loadPersistentState() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (!saved) {
        this.applyDefaultPersistentState();
        return;
      }
      this.applySavedPersistentState(JSON.parse(saved));
    } catch (e) {
      console.warn('Failed to load save data:', e);
      this.applyDefaultPersistentState();
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
        bgmEnabled: this.bgmEnabled,
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

  // 立証パートに進む準備ができたか判定
  isReadyForDebate() {
    const hasPoint1 = this.hasEvidence('cotton_micro');
    const hasPoint2 = this.hasEvidence('flower_footprint') || this.hasEvidence('caretaker_alibi');
    const hasPoint3 = this.hasEvidence('tree_nest') || this.hasEvidence('poppo_eyewitness');

    return hasPoint1 && hasPoint2 && hasPoint3;
  }

  // クリア記録
  recordClear(endingType) {
    if (endingType === 'HAPPY') {
      this.clearCount = Math.max(1, this.clearCount + 1);
    } else if (endingType === 'TRUE') {
      this.clearCount++;
      this.trueEndUnlocked = true;
    }
    this.savePersistentState();
  }

  // 完全リセット
  resetAllData() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.loadPersistentState();
    this.resetTransientState();
  }
}

window.gameState = new GameState();
