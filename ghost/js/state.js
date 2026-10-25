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
        this.hasClearedGame =
          parsed.hasClearedGame || parsed.hasClearedTrueEnd || parsed.hasClearedLoop1 || false;
        this.hasClearedTrueEnd = this.hasClearedGame;
        this.hasClearedLoop1 = this.hasClearedGame;
        if (typeof parsed.voiceEnabled === 'boolean') this.voiceEnabled = parsed.voiceEnabled;
        if (typeof parsed.seEnabled === 'boolean') this.seEnabled = parsed.seEnabled;
        if (typeof parsed.bgmEnabled === 'boolean') this.bgmEnabled = parsed.bgmEnabled;
      } else {
        this.hasClearedGame = false;
        this.hasClearedTrueEnd = false;
        this.hasClearedLoop1 = false;
      }
    } catch (e) {
      console.warn('Failed to load save data:', e);
      this.hasClearedGame = false;
      this.hasClearedTrueEnd = false;
      this.hasClearedLoop1 = false;
    }
  }

  // 永続セーブデータの保存
  savePersistentState() {
    try {
      const data = {
        hasClearedGame: this.hasClearedGame,
        hasClearedTrueEnd: this.hasClearedGame,
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

  isGameCleared() {
    return Boolean(this.hasClearedGame || this.hasClearedTrueEnd || this.hasClearedLoop1);
  }

  isClearedFirstLoop() {
    return this.isGameCleared();
  }

  isClearedTrueEnd() {
    return this.isGameCleared();
  }

  markGameCleared() {
    this.hasClearedGame = true;
    this.hasClearedTrueEnd = true;
    this.savePersistentState();
  }

  markLoop1Cleared() {
    this.markGameCleared();
  }

  markTrueEndCleared() {
    this.markGameCleared();
  }

  // 立証決定打4件の判定
  hasAllCriticalEvidence() {
    const criticalIds = ['sinkhole_route', 'honeypot_log', 'active_memory_ren', 'c2_target_ip'];
    return criticalIds.every((id) => this.collectedEvidence.has(id));
  }

  getCriticalEvidenceCount() {
    const criticalIds = ['sinkhole_route', 'honeypot_log', 'active_memory_ren', 'c2_target_ip'];
    return criticalIds.filter((id) => this.collectedEvidence.has(id)).length;
  }

  canEnterDebate() {
    return this.hasAllCriticalEvidence() || this.collectedEvidence.size >= 6;
  }

  resetAllData() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (e) {
      console.warn('Failed to clear storage:', e);
    }
    this.clearSessionProgress();
    this.hasClearedGame = false;
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
