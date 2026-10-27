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
    this.setDefaultPersistentFlags();
    this.resetTransientState();
    this.loadPersistentState();
  }

  hasAllCriticalEvidence() {
    return CRITICAL_EVIDENCE_IDS.every((id) => this.collectedEvidence.has(id));
  }

  setDefaultPersistentFlags() {
    this.hasClearedGame = false;
    this.hasClearedTrueEnd = false;
    this.maxUnlockedChapter = 1;
    this.voiceEnabled = true;
    this.seEnabled = true;
    this.bgmEnabled = true;
    this.voiceVolume = 1.0;
    this.seVolume = 0.7;
    this.bgmVolume = 0.2;
  }

  // 1回のプレイごとの一時状態リセット（音量やクリアフラグは絶対に上書きしない）
  resetTransientState() {
    this.currentChapter = 0; // 0: プロローグ, 1〜5: 各章, 6: エピローグ
    this.currentPhase = 'intro'; // intro | mid | resolution | choice | deduction
    this.currentBgmMode = 'investigate';
    this.currentLineIndex = 0;
    this.selectedChoices = {};
    this.failedChoices = {}; // { [choiceId]: [optionId, ...] }
    this.collectedEvidence = new Set();
    this.clearedChapters = new Set();
    this.defenseRate = 100; // 残存資産防衛率 (100%スタート、ミスで減少)
  }

  // 不正解の選択肢を記録（再試行時のグレーアウト無効化用）
  recordFailedChoice(choiceId, optionId) {
    if (!this.failedChoices[choiceId]) {
      this.failedChoices[choiceId] = [];
    }
    if (!this.failedChoices[choiceId].includes(optionId)) {
      this.failedChoices[choiceId].push(optionId);
    }
    this.saveSessionProgress();
  }

  isChoiceOptionFailed(choiceId, optionId) {
    return Boolean(this.failedChoices?.[choiceId]?.includes(optionId));
  }

  // 防衛率の減算（ペナルティ適用）
  applyDefensePenalty(amount = 10) {
    this.defenseRate = Math.max(0, this.defenseRate - amount);
    this.saveSessionProgress();
    return this.defenseRate;
  }

  // クリアランク判定 (S / A / B / C)
  getDefenseRank() {
    if (this.defenseRate >= 90) {
      return {
        rank: 'S',
        title: '完全電脳防衛（Sランク）',
        color: '#10b981',
        desc: '卓越した鑑識眼と判断力により、資産流出を最小限に抑え込み、26,739台の救出作戦を伝説的成功へと導いた！',
      };
    }
    if (this.defenseRate >= 75) {
      return {
        rank: 'A',
        title: '優秀防衛作戦（Aランク）',
        color: '#06b6d4',
        desc: '軽微な被害とタイムロスを被りながらも、冷静な論戦と鑑識で攻撃者の四重恐喝を瓦解させた！',
      };
    }
    if (this.defenseRate >= 60) {
      return {
        rank: 'B',
        title: '電脳戦辛勝（Bランク）',
        color: '#f59e0b',
        desc: '敵の偽旗工作とブラフに翻弄され被害が拡大したものの、土壇場のカナリア逆探知で反撃を成し遂げた。',
      };
    }
    return {
      rank: 'C',
      title: '薄氷の防衛（Cランク）',
      color: '#ef4444',
      desc: '多くの口座と資産が犠牲となり炎上を招いたが、国家サイバー防御の発動により最悪の全滅は免れた。',
    };
  }

  // セッション進行（オートセーブ）の保存
  saveSessionProgress() {
    try {
      const sessionData = {
        currentChapter: this.currentChapter,
        currentPhase: this.currentPhase,
        currentBgmMode: this.currentBgmMode,
        currentLineIndex: this.currentLineIndex,
        maxUnlockedChapter: this.maxUnlockedChapter,
        selectedChoices: this.selectedChoices,
        failedChoices: this.failedChoices,
        collectedEvidence: Array.from(this.collectedEvidence),
        clearedChapters: Array.from(this.clearedChapters),
        defenseRate: this.defenseRate,
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
      this.currentPhase = data.currentPhase || 'intro';
      this.currentBgmMode = data.currentBgmMode || 'investigate';
      this.currentLineIndex = typeof data.currentLineIndex === 'number' ? data.currentLineIndex : 0;
      this.maxUnlockedChapter = data.maxUnlockedChapter || 1;
      this.selectedChoices = data.selectedChoices || {};
      this.failedChoices = data.failedChoices || {};
      this.collectedEvidence = new Set(data.collectedEvidence || []);
      this.clearedChapters = new Set(data.clearedChapters || []);
      this.defenseRate = typeof data.defenseRate === 'number' ? data.defenseRate : 100;
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
      if (typeof parsed.voiceVolume === 'number') {
        this.voiceVolume = Math.max(0, Math.min(1, parsed.voiceVolume));
      }
      if (typeof parsed.seVolume === 'number') {
        this.seVolume = Math.max(0, Math.min(1, parsed.seVolume));
      }
      if (typeof parsed.bgmVolume === 'number') {
        this.bgmVolume = Math.max(0, Math.min(1, parsed.bgmVolume));
      }
    } catch (e) {
      console.warn('Failed to load save data:', e);
      this.setDefaultPersistentFlags();
    }
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
        voiceVolume: this.voiceVolume,
        seVolume: this.seVolume,
        bgmVolume: this.bgmVolume,
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
