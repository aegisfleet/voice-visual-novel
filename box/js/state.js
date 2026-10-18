// state.js - ゲーム状態・セーブデータ管理 (BOX WORM)

class GameState {
  constructor() {
    this.storageKey = 'box_worm_save_v1';
    this.sessionKey = 'box_worm_session_v1';
    this.resetTransientState();
    this.loadPersistentState();
  }

  // セッション進行（オートセーブ）の保存
  saveSessionProgress(activePhase = 'explore') {
    try {
      const sessionData = {
        currentLoop: this.currentLoop,
        activePhase,
        currentArea: window.gameApp ? window.gameApp.currentArea : 'room',
        currentDebateStep: this.currentDebateStep,
        life: this.life,
        collectedEvidence: Array.from(this.collectedEvidence),
        inspectedSpots: Array.from(this.inspectedSpots),
        talkedNpcs: Array.from(this.talkedNpcs),
        savedAt: Date.now(),
      };
      localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
    } catch (e) {
      console.warn('Failed to save session progress:', e);
    }
  }

  // 再開可能なセッションが存在するか判定
  hasSavedSession() {
    try {
      return Boolean(localStorage.getItem(this.sessionKey));
    } catch (_e) {
      return false;
    }
  }

  // セッション進行の復元
  loadSessionProgress() {
    try {
      const raw = localStorage.getItem(this.sessionKey);
      if (!raw) return null;
      const data = JSON.parse(raw);
      this.currentLoop = data.currentLoop || data.loopCount || (this.isClearedFirstLoop() ? 2 : 1);
      this.currentDebateStep = data.currentDebateStep || 0;
      this.life = typeof data.life === 'number' ? data.life : data.playerLife || 3;
      this.collectedEvidence = new Set(data.collectedEvidence || []);
      this.inspectedSpots = new Set(data.inspectedSpots || []);
      this.talkedNpcs = new Set(data.talkedNpcs || []);
      return data;
    } catch (e) {
      console.warn('Failed to load session progress:', e);
      return null;
    }
  }

  // セッション進行のクリア
  clearSessionProgress() {
    try {
      localStorage.removeItem(this.sessionKey);
    } catch (e) {
      console.warn('Failed to clear session progress:', e);
    }
  }

  // 1回のプレイごとの一時状態
  resetTransientState() {
    this.currentLoop = this.isClearedFirstLoop() ? 2 : 1; // 周回数
    this.life = 3; // ライフ（ハート3つ）
    this.collectedEvidence = new Set(); // 所持している証拠品ID
    this.inspectedSpots = new Set(); // 調査済みスポットID
    this.talkedNpcs = new Set(); // 会話済みNPC ID
    this.currentDebateStep = 0; // 立証パートの現在の問答インデックス
    this.voiceEnabled = true;
    this.seEnabled = true;
    this.bgmEnabled = true;
  }

  // ローカルストレージからの永続セーブデータ読み込み
  loadPersistentState() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const parsed = JSON.parse(data);
        this.hasClearedLoop1 = parsed.hasClearedLoop1 || false;
        this.hasClearedTrueEnd = parsed.hasClearedTrueEnd || false;
        this.currentLoop = this.hasClearedLoop1 ? 2 : 1;
        if (typeof parsed.voiceEnabled === 'boolean') this.voiceEnabled = parsed.voiceEnabled;
        if (typeof parsed.seEnabled === 'boolean') this.seEnabled = parsed.seEnabled;
        if (typeof parsed.bgmEnabled === 'boolean') this.bgmEnabled = parsed.bgmEnabled;
      } else {
        this.hasClearedLoop1 = false;
        this.hasClearedTrueEnd = false;
      }
    } catch (e) {
      console.warn('Failed to load save data:', e);
      this.hasClearedLoop1 = false;
      this.hasClearedTrueEnd = false;
    }
  }

  // 永続セーブデータの保存
  savePersistentState() {
    try {
      const data = {
        hasClearedLoop1: this.hasClearedLoop1,
        hasClearedTrueEnd: this.hasClearedTrueEnd,
        voiceEnabled: this.voiceEnabled,
        seEnabled: this.seEnabled,
        bgmEnabled: this.bgmEnabled,
        updatedAt: Date.now(),
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save state:', e);
    }
  }

  // 1周目クリア状態
  isClearedFirstLoop() {
    return !!this.hasClearedLoop1;
  }

  // 1周目クリア記録
  markLoop1Cleared() {
    this.hasClearedLoop1 = true;
    this.currentLoop = 2;
    this.savePersistentState();
  }

  // トゥルーエンドクリア記録
  markTrueEndCleared() {
    this.hasClearedTrueEnd = true;
    this.savePersistentState();
  }

  // 全データ初期化（ニューゲーム）
  resetAllData() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (e) {
      console.warn('Failed to clear storage:', e);
    }
    this.clearSessionProgress();
    this.hasClearedLoop1 = false;
    this.hasClearedTrueEnd = false;
    this.resetTransientState();
  }

  // 証拠品の追加
  addEvidence(evidenceId) {
    if (!this.collectedEvidence.has(evidenceId)) {
      this.collectedEvidence.add(evidenceId);
      return true;
    }
    return false;
  }

  // 証拠品の所持判定
  hasEvidence(evidenceId) {
    return this.collectedEvidence.has(evidenceId);
  }

  // スポット調査済み記録
  markSpotInspected(spotId) {
    this.inspectedSpots.add(spotId);
  }

  isSpotInspected(spotId) {
    return this.inspectedSpots.has(spotId);
  }

  // NPC会話済み記録
  markNpcTalked(npcId) {
    this.talkedNpcs.add(npcId);
  }

  isNpcTalked(npcId) {
    return this.talkedNpcs.has(npcId);
  }

  // ライフ減少
  decreaseLife() {
    if (this.life > 0) {
      this.life--;
    }
    return this.life;
  }
}

window.gameState = new GameState();
