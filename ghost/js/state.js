// state.js - ゲーム状態・章進行・セーブデータ管理 (GHOST PROTOCOL)

const CRITICAL_EVIDENCE_IDS = [
  'ad_demofastloss_log',
  'persistent_session_trap',
  'reverse_rdp_tsclient',
  'direct_compensation_matrix',
  'nco_three_walls_report',
  'canary_c2_origin',
];

const CHAPTER_REQUIRED_EVIDENCE = {
  1: ['ad_demofastloss_log'],
  2: ['persistent_session_trap'],
  3: ['reverse_rdp_tsclient'],
  4: ['direct_compensation_matrix'],
  5: ['nco_three_walls_report', 'canary_c2_origin'],
};

class GameState {
  constructor() {
    this.storageKey = 'ghost_protocol_save_v3';
    this.sessionKey = 'ghost_protocol_session_v3';
    this.resetTransientState();
    this.loadPersistentState();
  }

  // セッション進行（オートセーブ）の保存
  saveSessionProgress(activePhase = 'explore') {
    try {
      const sessionData = {
        activePhase,
        currentChapter: this.currentChapter,
        maxUnlockedChapter: this.maxUnlockedChapter,
        currentArea: window.gameApp ? window.gameApp.currentArea : 'desk',
        currentDebateStep: this.currentDebateStep,
        life: this.life,
        collectedEvidence: Array.from(this.collectedEvidence),
        inspectedSpots: Array.from(this.inspectedSpots),
        clearedChapters: Array.from(this.clearedChapters),
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
      this.applyLoadedSessionData(data);
      return data;
    } catch (e) {
      console.warn('Failed to load session progress:', e);
      return null;
    }
  }

  applyLoadedSessionData(data) {
    this.currentChapter = data.currentChapter || 1;
    this.maxUnlockedChapter = data.maxUnlockedChapter || this.currentChapter;
    this.currentDebateStep = data.currentDebateStep || 0;
    this.life = typeof data.life === 'number' ? data.life : 3;
    this.collectedEvidence = new Set(data.collectedEvidence || []);
    this.inspectedSpots = new Set(data.inspectedSpots || []);
    this.clearedChapters = new Set(data.clearedChapters || []);
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
    this.currentChapter = 1;
    this.maxUnlockedChapter = 1;
    this.life = 3;
    this.collectedEvidence = new Set();
    this.inspectedSpots = new Set();
    this.talkedNpcs = new Set();
    this.clearedChapters = new Set();
    this.currentDebateStep = 0;
    this.voiceEnabled = true;
    this.seEnabled = true;
    this.bgmEnabled = true;
  }

  // ローカルストレージからの永続セーブデータ読み込み
  loadPersistentState() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) {
        this.setDefaultPersistentFlags();
        return;
      }
      this.applyPersistentData(JSON.parse(data));
    } catch (e) {
      console.warn('Failed to load save data:', e);
      this.setDefaultPersistentFlags();
    }
  }

  setDefaultPersistentFlags() {
    this.hasClearedGame = false;
    this.hasClearedTrueEnd = false;
    this.hasClearedLoop1 = false;
  }

  applyPersistentData(parsed) {
    this.hasClearedGame = Boolean(
      parsed.hasClearedGame || parsed.hasClearedTrueEnd || parsed.hasClearedLoop1,
    );
    this.hasClearedTrueEnd = this.hasClearedGame;
    this.hasClearedLoop1 = this.hasClearedGame;
    if (typeof parsed.voiceEnabled === 'boolean') this.voiceEnabled = parsed.voiceEnabled;
    if (typeof parsed.seEnabled === 'boolean') this.seEnabled = parsed.seEnabled;
    if (typeof parsed.bgmEnabled === 'boolean') this.bgmEnabled = parsed.bgmEnabled;
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
    this.maxUnlockedChapter = 5;
    this.savePersistentState();
  }

  markLoop1Cleared() {
    this.markGameCleared();
  }

  markTrueEndCleared() {
    this.markGameCleared();
  }

  unlockChapter(chapterNum) {
    if (chapterNum > this.maxUnlockedChapter) {
      this.maxUnlockedChapter = Math.min(5, chapterNum);
    }
  }

  markChapterCleared(chapterNum) {
    this.clearedChapters.add(chapterNum);
    this.unlockChapter(chapterNum + 1);
  }

  isChapterCleared(chapterNum) {
    return this.clearedChapters.has(chapterNum);
  }

  hasChapterRequiredEvidence(chapterNum = this.currentChapter) {
    const reqList = CHAPTER_REQUIRED_EVIDENCE[chapterNum] || [];
    if (reqList.length === 0) return false;
    return reqList.every((id) => this.collectedEvidence.has(id));
  }

  // 全6件の鑑識決定打が揃っているか判定
  hasAllCriticalEvidence() {
    return CRITICAL_EVIDENCE_IDS.every((id) => this.collectedEvidence.has(id));
  }

  getCriticalEvidenceCount() {
    return CRITICAL_EVIDENCE_IDS.filter((id) => this.collectedEvidence.has(id)).length;
  }

  // 現在の章の真相解明ゲート（または最終聴聞）へ進めるか判定
  canEnterDebate() {
    return (
      this.hasChapterRequiredEvidence(this.currentChapter) ||
      this.hasAllCriticalEvidence() ||
      this.collectedEvidence.size >= 6
    );
  }

  resetAllData() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (e) {
      console.warn('Failed to clear storage:', e);
    }
    this.clearSessionProgress();
    this.setDefaultPersistentFlags();
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
