// state.js - ゲーム状態と永続化（localStorage）の管理（本格ミステリー版）

class GameState {
  constructor() {
    this.STORAGE_KEY = 'vvn_pomeranian_save_v2';
    this.resetTransientState();
    this.loadPersistentState();
  }

  // 1プレイごとの一時状態の初期化
  resetTransientState() {
    this.currentPhase = 'TITLE'; // 'TITLE', 'PROLOGUE', 'EXPLORATION', 'DEBATE', 'ENDING'
    this.life = 3;               // 立証パートのライフ (最大3)
    this.currentDebateStep = 0;  // 立証パートの問答番号
    this.evidence = [];          // 所持している証拠IDリスト
    this.examinedSpots = [];     // 調査済みスポット・NPCリスト
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

  // 立証パートに進む準備ができたか判定
  // 3つの論点それぞれについて、少なくとも1つずつ正解の証拠（物的または証言）を持っているか判定
  isReadyForDebate() {
    // 論点1（手口）：cotton_micro
    const hasPoint1 = this.hasEvidence('cotton_micro');

    // 論点2（時間・犯人）：flower_footprint または caretaker_alibi
    const hasPoint2 = this.hasEvidence('flower_footprint') || this.hasEvidence('caretaker_alibi');

    // 論点3（到達点・樹上）：tree_nest または poppo_eyewitness
    const hasPoint3 = this.hasEvidence('tree_nest') || this.hasEvidence('poppo_eyewitness');

    return hasPoint1 && hasPoint2 && hasPoint3;
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

  // 完全リセット
  resetAllData() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.loadPersistentState();
    this.resetTransientState();
  }
}

window.gameState = new GameState();
