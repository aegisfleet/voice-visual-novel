// state.js - ゲーム状態・章進行・セーブデータ管理 (GHOST PROTOCOL 体験型ノベル版)

const CRITICAL_EVIDENCE_IDS = [
  'ad_demofastloss_log',
  'persistent_session_trap',
  'reverse_rdp_tsclient',
  'direct_compensation_matrix',
  'nco_three_walls_report',
  'canary_c2_origin',
];

class GameState {
  constructor() {
    this.storageKey = 'ghost_protocol_novel_save_v1';
    this.sessionKey = 'ghost_protocol_novel_session_v1';
    this.resetTransientState();
    this.loadPersistentState();
  }

  hasAllCriticalEvidence() {
    return CRITICAL_EVIDENCE_IDS.every((id) => this.collectedEvidence.has(id));
  }

  // 1回のプレイごとの一時状態リセット
  resetTransientState() {
    this.currentChapter = 0; // 0: プロローグ, 1〜5: 各章, 6: エピローグ
    this.currentPhase = 'dialogue'; // dialogue | choice | resolution | ending
    this.currentLineIndex = 0;
    this.maxUnlockedChapter = 1;
    this.selectedChoices = {};
    this.collectedEvidence = new Set();
    this.clearedChapters = new Set();
    this.voiceEnabled = true;
    this.seEnabled = true;
    this.bgmEnabled = true;
  }

  // セッション進行（オートセーブ）の保存
  saveSessionProgress() {
    try {
      const sessionData = {
        currentChapter: this.currentChapter,
        currentPhase: this.currentPhase,
        currentLineIndex: this.currentLineIndex,
        maxUnlockedChapter: this.maxUnlockedChapter,
        selectedChoices: this.selectedChoices,
        collectedEvidence: Array.from(this.collectedEvidence),
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
      this.currentChapter = typeof data.currentChapter === 'number' ? data.currentChapter : 0;
      this.currentPhase = data.currentPhase || 'dialogue';
      this.currentLineIndex = typeof data.currentLineIndex === 'number' ? data.currentLineIndex : 0;
      this.maxUnlockedChapter = data.maxUnlockedChapter || 1;
      this.selectedChoices = data.selectedChoices || {};
      this.collectedEvidence = new Set(data.collectedEvidence || []);
      this.clearedChapters = new Set(data.clearedChapters || []);
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

  // ローカルストレージからの永続セーブデータ読み込み
  loadPersistentState() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) {
        this.setDefaultPersistentFlags();
        return;
      }
      const parsed = JSON.parse(raw);
      this.hasClearedGame = Boolean(parsed.hasClearedGame || parsed.hasClearedTrueEnd);
      this.hasClearedTrueEnd = this.hasClearedGame;
      this.maxUnlockedChapter = parsed.maxUnlockedChapter || 1;
      if (typeof parsed.voiceEnabled === 'boolean') this.voiceEnabled = parsed.voiceEnabled;
      if (typeof parsed.seEnabled === 'boolean') this.seEnabled = parsed.seEnabled;
      if (typeof parsed.bgmEnabled === 'boolean') this.bgmEnabled = parsed.bgmEnabled;
    } catch (e) {
      console.warn('Failed to load save data:', e);
      this.setDefaultPersistentFlags();
    }
  }

  setDefaultPersistentFlags() {
    this.hasClearedGame = false;
    this.hasClearedTrueEnd = false;
  }

  // 永続セーブデータの保存
  savePersistentState() {
    try {
      const data = {
        hasClearedGame: this.hasClearedGame,
        hasClearedTrueEnd: this.hasClearedTrueEnd,
        maxUnlockedChapter: this.maxUnlockedChapter,
        voiceEnabled: this.voiceEnabled,
        seEnabled: this.seEnabled,
        bgmEnabled: this.bgmEnabled,
        updatedAt: Date.now(),
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save persistent state:', e);
    }
  }

  unlockChapter(chId) {
    if (chId > this.maxUnlockedChapter) {
      this.maxUnlockedChapter = Math.min(5, chId);
      this.savePersistentState();
    }
  }

  markChapterCleared(chId) {
    this.clearedChapters.add(chId);
    this.unlockChapter(chId + 1);
    this.saveSessionProgress();
  }

  isChapterCleared(chId) {
    return this.clearedChapters.has(chId);
  }

  addEvidence(evidenceId) {
    if (!this.collectedEvidence.has(evidenceId)) {
      this.collectedEvidence.add(evidenceId);
      this.saveSessionProgress();
      return true;
    }
    return false;
  }

  hasEvidence(evidenceId) {
    return this.collectedEvidence.has(evidenceId);
  }

  recordChoice(choiceId, optionId) {
    this.selectedChoices[choiceId] = optionId;
    this.saveSessionProgress();
  }

  markGameCleared() {
    this.hasClearedGame = true;
    this.hasClearedTrueEnd = true;
    this.maxUnlockedChapter = 5;
    this.savePersistentState();
    this.saveSessionProgress();
  }

  isGameCleared() {
    return Boolean(this.hasClearedGame || this.hasClearedTrueEnd);
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
}

window.gameState = new GameState();
