// state.js - ゲーム状態・セーブデータ管理 (GHOST SCHEMA)

class GameState {
  constructor() {
    this.storageKey = 'ghost_schema_save_v1';
    this.sessionKey = 'ghost_schema_session_v1';
    this.resetTransientState();
    this.loadPersistentState();
  }

  // セッション進行（オートセーブ）の保存
  saveSessionProgress(activePhase = 'explore') {
    try {
      const sessionData = {
        currentLoop: this.currentLoop,
        activePhase,
        currentArea: window.gameApp ? window.gameApp.currentArea : 'desk',
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
      this.currentLoop = data.currentLoop || (this.isClearedFirstLoop() ? 2 : 1);
      this.currentDebateStep = data.currentDebateStep || 0;
      this.life = typeof data.life === 'number' ? data.life : 3;
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

  // 1回のプレイごとの一時状態リセット
  resetTransientState() {
    this.currentLoop = this.isClearedFirstLoop() ? 2 : 1;
    this.life = 3; // ライフ（ハート3つ）
    this.collectedEvidence = new Set();
    this.inspectedSpots = new Set();
    this.talkedNpcs = new Set();
    this.currentDebateStep = 0;
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

  isClearedFirstLoop() {
    return Boolean(this.hasClearedLoop1);
  }

  isClearedTrueEnd() {
    return Boolean(this.hasClearedTrueEnd);
  }

  markLoop1Cleared() {
    this.hasClearedLoop1 = true;
    this.currentLoop = 2;
    this.savePersistentState();
  }

  markTrueEndCleared() {
    this.hasClearedTrueEnd = true;
    this.savePersistentState();
  }

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

  addEvidence(evidenceId) {
    if (!this.collectedEvidence.has(evidenceId)) {
      this.collectedEvidence.add(evidenceId);
      return true;
    }
    return false;
  }

  hasEvidence(evidenceId) {
    return this.collectedEvidence.has(evidenceId);
  }

  markSpotInspected(spotId) {
    this.inspectedSpots.add(spotId);
  }

  isSpotInspected(spotId) {
    return this.inspectedSpots.has(spotId);
  }

  markNpcTalked(npcId) {
    this.talkedNpcs.add(npcId);
  }

  isNpcTalked(npcId) {
    return this.talkedNpcs.has(npcId);
  }

  decreaseLife() {
    if (this.life > 0) {
      this.life -= 1;
    }
    return this.life;
  }

  recoverLife() {
    this.life = 3;
    return this.life;
  }
}

window.gameState = new GameState();
