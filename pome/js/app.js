// app.js - メインゲームコントローラ（主人公パム・全SVGアニメーション・1周完結シナリオ版）

class GameApp {
  constructor() {
    this.audio = window.audioMgr;
    this.state = window.gameState;
    this.scenario = window.SCENARIO_DATA;

    this.character = new PomeCharacterController(
      document.getElementById('character-stage'),
      document.getElementById('emotion-bubble'),
    );

    this.dialogueQueue = [];
    this.currentDialogueCallback = null;
    this.selectedEvidenceId = null;
    this.isChoiceActive = false;

    this.backlog = [];
    this.isAutoMode = false;
    this.isSkipMode = false;
    this.autoTimer = null;
    this.typewriterTimer = null;
    this.walkerTimer = null;
    this.isTyping = false;
    this.currentFullText = '';
    this.currentSpeaker = '';
    this.currentArea = 'plaza';

    this.dom = this.cacheDomElements();
    this.bindEvents();
    this.updateTitleView();
  }

  cacheDomElements() {
    return {
      viewport: document.getElementById('viewport'),
      hud: document.getElementById('hud'),
      hudLoopBadge: document.getElementById('hud-loop-badge'),
      hudLifeContainer: document.getElementById('hud-life-container'),
      hudHearts: document.getElementById('hud-hearts'),
      evidenceCount: document.getElementById('evidence-count'),
      btnEvidenceBag: document.getElementById('btn-evidence-bag'),
      btnToggleVoice: document.getElementById('btn-toggle-voice'),
      btnToggleSe: document.getElementById('btn-toggle-se'),
      btnToggleBgm: document.getElementById('btn-toggle-bgm'),

      screenTitle: document.getElementById('screen-title'),
      screenExplore: document.getElementById('screen-explore'),
      screenDebate: document.getElementById('screen-debate'),
      screenEnding: document.getElementById('screen-ending'),

      titleLoopInfo: document.getElementById('title-loop-info'),
      titleClearBadge: document.getElementById('title-clear-badge'),
      btnStartGame: document.getElementById('btn-start-game'),
      btnResetSave: document.getElementById('btn-reset-save'),

      areaNavPlaza: document.getElementById('btn-area-plaza'),
      areaNavGrove: document.getElementById('btn-area-grove'),
      badgeAreaPlaza: document.getElementById('badge-area-plaza'),
      badgeAreaGrove: document.getElementById('badge-area-grove'),
      areaPlaza: document.getElementById('area-plaza'),
      areaGrove: document.getElementById('area-grove'),
      portalToGrove: document.getElementById('portal-to-grove'),
      portalToPlaza: document.getElementById('portal-to-plaza'),
      parkMap: document.getElementById('park-map'),
      spotSecretBush: document.getElementById('spot_secret_bush'),
      pomeWalker: document.getElementById('pome-walker'),
      exploreStatusText: document.getElementById('explore-status-text'),
      evidenceNeededCounter: document.getElementById('evidence-needed-counter'),
      btnGoToDebate: document.getElementById('btn-go-to-debate'),

      debateToraAvatar: document.getElementById('debate-tora-avatar'),
      debatePomeAvatar: document.getElementById('debate-pome-avatar'),
      opponentStatus: document.getElementById('opponent-status'),
      debateTurnLabel: document.getElementById('debate-turn-label'),
      debateOpponentSpeech: document.getElementById('debate-opponent-speech'),
      debateHintText: document.getElementById('debate-hint-text'),
      selectedEvidencePreview: document.getElementById('selected-evidence-preview'),
      debateSelectedHint: document.getElementById('debate-selected-hint'),
      debateEvidenceList: document.getElementById('debate-evidence-list'),
      btnBackToExplore: document.getElementById('btn-back-to-explore'),
      btnPresentEvidence: document.getElementById('btn-present-evidence'),
      debateSpeedlines: document.getElementById('debate-speedlines'),

      dialogueBackdrop: document.getElementById('dialogue-backdrop'),
      dialogueStage: document.getElementById('dialogue-stage'),
      characterStage: document.getElementById('character-stage'),
      emotionBubble: document.getElementById('emotion-bubble'),
      novelWindow: document.getElementById('novel-window'),
      dialogueSpeakerIcon: document.getElementById('dialogue-speaker-icon'),
      dialogueSpeaker: document.getElementById('dialogue-speaker'),
      dialogueText: document.getElementById('dialogue-text'),
      dialogueChoices: document.getElementById('dialogue-choices'),
      dialoguePrompt: document.getElementById('dialogue-prompt'),
      btnDialogueAuto: document.getElementById('btn-dialogue-auto'),
      btnDialogueSkip: document.getElementById('btn-dialogue-skip'),
      btnDialogueLog: document.getElementById('btn-dialogue-log'),

      overlayCutin: document.getElementById('overlay-cutin'),

      endingIcon: document.getElementById('ending-icon'),
      endingTitle: document.getElementById('ending-title'),
      endingSub: document.getElementById('ending-sub'),
      endingDesc: document.getElementById('ending-desc'),
      endingUnlockedBanner: document.getElementById('ending-unlocked-banner'),
      btnEndingExplore: document.getElementById('btn-ending-explore'),
      btnEndingNext: document.getElementById('btn-ending-next'),

      modalEvidence: document.getElementById('modal-evidence'),
      modalEvidenceList: document.getElementById('modal-evidence-list'),
      btnCloseModal: document.getElementById('btn-close-modal'),
      backdropEvidence: document.getElementById('backdrop-evidence'),

      modalBacklog: document.getElementById('modal-backlog'),
      modalBacklogList: document.getElementById('modal-backlog-list'),
      btnCloseBacklog: document.getElementById('btn-close-backlog'),
      backdropBacklog: document.getElementById('backdrop-backlog'),
    };
  }

  bindEvents() {
    this.bindTitleAndHudEvents();
    this.bindAreaAndMapEvents();
    this.bindDialogueAndModalEvents();
    this.bindDebateAndEndingEvents();
  }

  bindTitleAndHudEvents() {
    this.dom.btnStartGame.addEventListener('click', () => {
      this.audio.playClick();
      this.audio.startBgm();
      this.startPrologue();
    });

    this.dom.btnResetSave.addEventListener('click', () => {
      if (confirm('セーブデータを初期化して最初から遊びますか？')) {
        this.state.resetAllData();
        this.updateTitleView();
        alert('セーブデータを初期化しました。');
      }
    });

    this.dom.btnToggleVoice.addEventListener('click', () => {
      this.state.voiceEnabled = this.audio.toggleVoice();
      this.state.savePersistentState();
      this.syncAudioButtonsText();
    });

    this.dom.btnToggleSe.addEventListener('click', () => {
      this.state.seEnabled = this.audio.toggleSe();
      this.state.savePersistentState();
      this.syncAudioButtonsText();
    });

    this.dom.btnToggleBgm.addEventListener('click', () => {
      this.state.bgmEnabled = this.audio.toggleBgm();
      this.state.savePersistentState();
      this.syncAudioButtonsText();
    });
  }

  syncAudioButtonsText() {
    const voiceLabel = ['🗣️ 音声: OFF', '🗣️ 音声: ON'][Number(Boolean(this.state.voiceEnabled))];
    const seLabel = ['🔔 SE: OFF', '🔔 SE: ON'][Number(Boolean(this.state.seEnabled))];
    const bgmLabel = ['🎵 BGM: OFF', '🎵 BGM: ON'][Number(Boolean(this.state.bgmEnabled))];
    this.dom.btnToggleVoice.textContent = voiceLabel;
    this.dom.btnToggleSe.textContent = seLabel;
    this.dom.btnToggleBgm.textContent = bgmLabel;
  }

  bindAreaAndMapEvents() {
    if (this.dom.areaNavPlaza) {
      this.dom.areaNavPlaza.addEventListener('click', () => this.switchArea('plaza'));
    }
    if (this.dom.areaNavGrove) {
      this.dom.areaNavGrove.addEventListener('click', () => this.switchArea('grove'));
    }
    if (this.dom.portalToGrove) {
      this.dom.portalToGrove.addEventListener('click', () => this.switchArea('grove'));
    }
    if (this.dom.portalToPlaza) {
      this.dom.portalToPlaza.addEventListener('click', () => this.switchArea('plaza'));
    }

    document.querySelectorAll('.spot-object').forEach((el) => {
      el.addEventListener('click', () => {
        this.handleSpotClick(el.getAttribute('data-spot'), el);
      });
    });

    document.querySelectorAll('.npc-actor').forEach((el) => {
      el.addEventListener('click', () => {
        this.handleNpcClick(el.getAttribute('data-npc'), el);
      });
    });
  }

  bindDialogueAndModalEvents() {
    this.dom.btnEvidenceBag.addEventListener('click', () => {
      this.audio.playClick();
      this.openEvidenceModal();
    });
    this.dom.btnCloseModal.addEventListener('click', () => {
      this.audio.playClick();
      this.dom.modalEvidence.classList.add('hidden');
    });
    if (this.dom.backdropEvidence) {
      this.dom.backdropEvidence.addEventListener('click', () => {
        this.dom.modalEvidence.classList.add('hidden');
      });
    }

    this.dom.btnDialogueAuto.addEventListener('click', (e) => {
      e.stopPropagation();
      this.audio.playClick();
      this.toggleAutoMode();
    });

    this.dom.btnDialogueSkip.addEventListener('click', (e) => {
      e.stopPropagation();
      this.audio.playClick();
      this.toggleSkipMode();
    });

    this.dom.btnDialogueLog.addEventListener('click', (e) => {
      e.stopPropagation();
      this.audio.playClick();
      this.openBacklogModal();
    });

    this.dom.btnCloseBacklog.addEventListener('click', () => {
      this.audio.playClick();
      this.closeBacklogModal();
    });
    this.dom.backdropBacklog.addEventListener('click', () => {
      this.closeBacklogModal();
    });

    this.dom.novelWindow.addEventListener('click', (e) => {
      this.handleNovelWindowClick(e);
    });
  }

  handleNovelWindowClick(e) {
    if (this.isChoiceActive) return;
    if (e.target.closest('.novel-ctrl-btn') || e.target.closest('.dialogue-choice-btn')) return;

    if (this.isTyping) {
      this.finishTyping();
    } else {
      this.advanceDialogue();
    }
  }

  bindDebateAndEndingEvents() {
    this.dom.btnGoToDebate.addEventListener('click', () => {
      this.audio.playBark();
      this.startDebate();
    });

    if (this.dom.btnBackToExplore) {
      this.dom.btnBackToExplore.addEventListener('click', () => {
        this.audio.playClick();
        this.backToExploration();
      });
    }

    this.dom.btnPresentEvidence.addEventListener('click', () => {
      this.handlePresentEvidence();
    });

    if (this.dom.btnEndingExplore) {
      this.dom.btnEndingExplore.addEventListener('click', () => {
        this.audio.playClick();
        this.dom.screenEnding.classList.add('hidden');
        this.backToExploration();
      });
    }

    this.dom.btnEndingNext.addEventListener('click', () => {
      this.handleEndingNextClick();
    });
  }

  handleEndingNextClick() {
    this.audio.playClick();
    this.dom.screenEnding.classList.add('hidden');

    if (this.state.endingType === 'BAD') {
      this.startDebate();
      return;
    }

    this.showScreen('screenTitle');
    this.dom.hud.classList.add('hidden');
    this.updateTitleView();
  }

  showScreen(screenKey) {
    ['screenTitle', 'screenExplore', 'screenDebate'].forEach((k) => {
      if (this.dom[k]) this.dom[k].classList.remove('active');
    });
    if (this.dom[screenKey]) {
      this.dom[screenKey].classList.add('active');
    }
  }

  updateTitleView() {
    const cleared = this.state.isCleared();
    if (cleared) {
      this.dom.titleLoopInfo.textContent = '🌟 クリア済み：ひだまり公園の名誉ボス犬パム';
      this.dom.titleLoopInfo.style.background = '#ffe8d6';
      this.dom.titleLoopInfo.style.color = '#7a3e10';
    } else {
      this.dom.titleLoopInfo.textContent = '✨ 全4問・1周完結のハートフル推理ノベル';
    }

    this.dom.titleClearBadge.classList.toggle('hidden', !cleared);

    this.audio.voiceEnabled = this.state.voiceEnabled;
    this.audio.seEnabled = this.state.seEnabled;
    this.audio.bgmEnabled = this.state.bgmEnabled;
    this.syncAudioButtonsText();
  }

  playDialogueQueue(queue, callback) {
    this.dialogueQueue = [...queue];
    this.currentDialogueCallback = callback || null;
    this.isChoiceActive = false;
    this.dom.dialogueChoices.classList.add('hidden');
    this.dom.dialoguePrompt.classList.remove('hidden');

    this.dom.dialogueBackdrop.classList.remove('hidden');
    this.dom.dialogueStage.classList.remove('hidden');
    this.dom.novelWindow.classList.remove('hidden');

    this.advanceDialogue();
  }

  closeDialogueLayer() {
    this.character.hide();
    this.dom.dialogueBackdrop.classList.add('hidden');
    this.dom.dialogueStage.classList.add('hidden');
    this.dom.novelWindow.classList.add('hidden');
  }

  advanceDialogue() {
    clearTimeout(this.typewriterTimer);
    clearTimeout(this.autoTimer);

    if (this.dialogueQueue.length === 0) {
      this.audio.stopSpeech();
      this.stopAutoMode();

      if (this.currentDialogueCallback) {
        const cb = this.currentDialogueCallback;
        this.currentDialogueCallback = null;
        cb();
        return;
      }

      this.closeDialogueLayer();
      return;
    }

    const current = this.dialogueQueue.shift();
    this.currentSpeaker = current.speaker;
    this.currentFullText = current.text;

    this.character.showForDialogue(current);
    this.updateSpeakerDisplay(current.speaker);
    this.backlog.push({ speaker: current.speaker, text: current.text });
    this.audio.speak(current.speaker, current.text);
    this.startTypewriter(current.text);
  }

  startTypewriter(text) {
    clearTimeout(this.typewriterTimer);
    clearTimeout(this.autoTimer);
    this.isTyping = true;
    this.character.startTalking();

    if (this.isSkipMode) {
      this.finishTyping();
      return;
    }

    this.dom.dialogueText.textContent = '';
    let index = 0;
    const speed = 24;

    const typeChar = () => {
      if (!this.isTyping) return;
      if (index < text.length) {
        this.dom.dialogueText.textContent += text.charAt(index);
        index++;
        if (index % 3 === 0) {
          this.audio.playTextBlip();
        }
        this.typewriterTimer = setTimeout(typeChar, speed);
      } else {
        this.finishTyping();
      }
    };

    typeChar();
  }

  finishTyping() {
    clearTimeout(this.typewriterTimer);
    this.isTyping = false;
    this.dom.dialogueText.textContent = this.currentFullText;
    this.character.stopTalking();

    if (this.isAutoMode && !this.isChoiceActive) {
      const readingDelay = Math.min(3400, Math.max(1400, this.currentFullText.length * 68));
      this.autoTimer = setTimeout(() => {
        this.advanceDialogue();
      }, readingDelay);
    } else if (this.isSkipMode && !this.isChoiceActive) {
      setTimeout(() => {
        this.advanceDialogue();
      }, 70);
    }
  }

  resolveSpeakerStyle(speaker) {
    const styles = [
      { match: 'パム', icon: '🐶', tagClass: 'speaker-tag pome-speaker' },
      { match: 'ポメ', icon: '🐶', tagClass: 'speaker-tag pome-speaker' },
      { match: 'トラ吉', icon: '😼', tagClass: 'speaker-tag tora-speaker' },
      { match: '管理人', icon: '👴', tagClass: 'speaker-tag npc-speaker' },
      { match: 'ポッポ', icon: '🕊️', tagClass: 'speaker-tag npc-speaker' },
      { match: 'クロ', icon: '🐈‍⬛', tagClass: 'speaker-tag kuro-speaker' },
      { match: 'シマリス', icon: '🐿️', tagClass: 'speaker-tag npc-speaker' },
      { match: 'チビ', icon: '🐿️', tagClass: 'speaker-tag npc-speaker' },
      { match: 'ミケ', icon: '🐱', tagClass: 'speaker-tag tora-speaker' },
      { match: '子猫', icon: '🐱', tagClass: 'speaker-tag npc-speaker' },
      { match: '飼い主', icon: '👩', tagClass: 'speaker-tag pome-speaker' },
      { match: 'ナレーション', icon: '📖', tagClass: 'speaker-tag narrator-speaker' },
    ];
    const found = styles.find((s) => speaker.includes(s.match));
    return found || { icon: '🐾', tagClass: 'speaker-tag' };
  }

  updateSpeakerDisplay(speaker) {
    this.dom.dialogueSpeaker.textContent = speaker;
    const { icon, tagClass } = this.resolveSpeakerStyle(speaker);
    this.dom.dialogueSpeakerIcon.textContent = icon;
    this.dom.dialogueSpeaker.className = tagClass;
  }

  toggleAutoMode() {
    this.isAutoMode = !this.isAutoMode;
    if (this.isAutoMode) {
      this.isSkipMode = false;
      this.dom.btnDialogueSkip.classList.remove('active');
    }
    this.dom.btnDialogueAuto.classList.toggle('active', this.isAutoMode);

    if (this.isAutoMode && !this.isTyping && !this.isChoiceActive) {
      this.advanceDialogue();
    }
  }

  toggleSkipMode() {
    this.isSkipMode = !this.isSkipMode;
    if (this.isSkipMode) {
      this.isAutoMode = false;
      this.dom.btnDialogueAuto.classList.remove('active');
    }
    this.dom.btnDialogueSkip.classList.toggle('active', this.isSkipMode);

    if (this.isSkipMode) {
      this.finishTyping();
      if (!this.isChoiceActive) {
        this.advanceDialogue();
      }
    }
  }

  stopAutoMode() {
    clearTimeout(this.autoTimer);
    this.isAutoMode = false;
    this.isSkipMode = false;
    this.dom.btnDialogueAuto.classList.remove('active');
    this.dom.btnDialogueSkip.classList.remove('active');
  }

  openBacklogModal() {
    this.dom.modalBacklogList.innerHTML = '';
    if (this.backlog.length === 0) {
      this.dom.modalBacklogList.innerHTML =
        '<p style="text-align:center; color:#79665c; padding:20px;">まだ会話履歴はありません。</p>';
    } else {
      this.backlog.forEach((item) => {
        const div = document.createElement('div');
        div.className = 'backlog-item';
        div.innerHTML = `
          <span class="backlog-item-speaker">${item.speaker}</span>
          <span class="backlog-item-text">${item.text}</span>
        `;
        this.dom.modalBacklogList.appendChild(div);
      });
      setTimeout(() => {
        this.dom.modalBacklogList.scrollTop = this.dom.modalBacklogList.scrollHeight;
      }, 50);
    }
    this.dom.modalBacklog.classList.remove('hidden');
  }

  closeBacklogModal() {
    this.dom.modalBacklog.classList.add('hidden');
  }

  showChoices(choices, onSelect) {
    this.isChoiceActive = true;
    this.dom.dialogueBackdrop.classList.remove('hidden');
    this.dom.dialogueStage.classList.remove('hidden');
    this.dom.novelWindow.classList.remove('hidden');
    this.dom.dialoguePrompt.classList.add('hidden');
    this.dom.dialogueChoices.innerHTML = '';
    this.dom.dialogueChoices.classList.remove('hidden');

    choices.forEach((ch) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'dialogue-choice-btn';
      btn.textContent = ch.text;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.audio.playClick();
        this.isChoiceActive = false;
        this.dom.dialogueChoices.classList.add('hidden');
        this.dom.dialoguePrompt.classList.remove('hidden');
        onSelect(ch);
      });
      this.dom.dialogueChoices.appendChild(btn);
    });
  }

  startPrologue() {
    this.state.resetTransientState();
    this.dom.hud.classList.remove('hidden');
    this.dom.hudLifeContainer.classList.add('hidden');
    this.dom.hudLoopBadge.textContent = '🐾 お散歩導入';
    this.updateEvidenceCounter();

    document.querySelectorAll('.spot-object, .npc-actor').forEach((el) => {
      el.classList.remove('is-examined');
    });

    this.playDialogueQueue(this.scenario.prologue, () => {
      this.startExploration();
    });
  }

  startExploration() {
    this.state.currentPhase = 'EXPLORATION';
    this.dom.hudLifeContainer.classList.add('hidden');
    this.dom.hudLoopBadge.textContent = '🔍 捜査パート';
    this.showScreen('screenExplore');
    this.switchArea(this.currentArea || 'plaza');

    if (this.dom.spotSecretBush) {
      this.dom.spotSecretBush.classList.remove('hidden');
    }

    this.updateExplorationUi();
  }

  backToExploration() {
    this.closeDialogueLayer();
    this.startExploration();
  }

  updateAreaDomClasses(isPlaza) {
    if (this.dom.areaPlaza) {
      this.dom.areaPlaza.classList.toggle('active', isPlaza);
      this.dom.areaPlaza.classList.toggle('hidden', !isPlaza);
    }
    if (this.dom.areaGrove) {
      this.dom.areaGrove.classList.toggle('active', !isPlaza);
      this.dom.areaGrove.classList.toggle('hidden', isPlaza);
    }
    if (this.dom.areaNavPlaza) this.dom.areaNavPlaza.classList.toggle('active', isPlaza);
    if (this.dom.areaNavGrove) this.dom.areaNavGrove.classList.toggle('active', !isPlaza);
  }

  switchArea(areaKey) {
    this.currentArea = areaKey;
    this.audio.playClick();

    const isPlaza = areaKey === 'plaza';
    this.updateAreaDomClasses(isPlaza);

    const locationBadge = document.getElementById('hud-location-badge');
    if (locationBadge) {
      locationBadge.textContent = ['🌲 ケヤキの森', '🐾 ひだまり広場'][Number(isPlaza)];
    }

    if (this.dom.pomeWalker) {
      this.dom.pomeWalker.style.left = ['32%', '24%'][Number(isPlaza)];
      this.dom.pomeWalker.style.top = ['66%', '68%'][Number(isPlaza)];
    }

    this.updateExplorationUi();
  }

  handleSpotClick(spotId, element) {
    if (this.state.currentPhase !== 'EXPLORATION' || this.isChoiceActive) return;

    this.moveWalkerTo(element);

    const spotData = this.scenario.spots.find((s) => s.id === spotId);
    if (!spotData) return;

    this.audio.playBark();

    this.playDialogueQueue(spotData.inspectText, () => {
      if (spotData.evidenceId && this.state.addEvidence(spotData.evidenceId)) {
        this.audio.playFound();
      }
      this.state.markSpotExamined(spotId);
      element.classList.add('is-examined');
      this.updateExplorationUi();
    });
  }

  handleNpcClick(npcId, element) {
    if (this.state.currentPhase !== 'EXPLORATION' || this.isChoiceActive) return;

    this.moveWalkerTo(element);

    const npcData = this.scenario.npcs.find((n) => n.id === npcId);
    if (!npcData) return;

    this.audio.playBark();

    this.playDialogueQueue(npcData.dialogue.intro, () => {
      this.showChoices(npcData.dialogue.choices, (chosen) => {
        this.onNpcChoiceSelected(npcId, element, chosen);
      });
    });
  }

  onNpcChoiceSelected(npcId, element, chosen) {
    this.playDialogueQueue(chosen.responses, () => {
      if (chosen.giveEvidence) {
        if (this.state.addEvidence(chosen.giveEvidence)) {
          this.audio.playFound();
        }
        this.state.markSpotExamined(npcId);
        element.classList.add('is-examined');
      } else if (chosen.isCorrect) {
        this.state.markSpotExamined(npcId);
        element.classList.add('is-examined');
      }
      this.updateExplorationUi();
    });
  }

  moveWalkerTo(element) {
    const rect = element.getBoundingClientRect();
    const mapRect = this.dom.parkMap.getBoundingClientRect();
    if (!mapRect.width || !mapRect.height) return;

    const leftPercent = ((rect.left - mapRect.left + rect.width / 2) / mapRect.width) * 100;
    const topPercent = ((rect.top - mapRect.top + rect.height / 2) / mapRect.height) * 100;
    const currentLeft = Number.parseFloat(this.dom.pomeWalker.style.left || '24');

    this.dom.pomeWalker.classList.toggle('walk-left', leftPercent < currentLeft);
    this.dom.pomeWalker.classList.add('is-walking');
    clearTimeout(this.walkerTimer);
    this.walkerTimer = setTimeout(() => {
      this.dom.pomeWalker.classList.remove('is-walking');
    }, 520);

    this.dom.pomeWalker.style.left = `${Math.max(8, Math.min(86, leftPercent - 4))}%`;
    this.dom.pomeWalker.style.top = `${Math.max(25, Math.min(82, topPercent + 4))}%`;
  }

  countRemainingKeyClues(areaKey) {
    const areaMap = {
      plaza: ['cotton_micro', 'flower_footprint', 'caretaker_alibi', 'kitten_ribbon'],
      grove: ['tree_nest', 'poppo_eyewitness'],
    };
    const keys = areaMap[areaKey] || [];
    return keys.filter((k) => !this.state.hasEvidence(k)).length;
  }

  setSingleAreaBadge(badgeEl, remCount) {
    if (!badgeEl) return;
    badgeEl.textContent = remCount > 0 ? `重要あと${remCount}` : '✔ 完了';
    badgeEl.classList.toggle('is-complete', remCount === 0);
  }

  updateAreaNavBadges() {
    this.setSingleAreaBadge(this.dom.badgeAreaPlaza, this.countRemainingKeyClues('plaza'));
    this.setSingleAreaBadge(this.dom.badgeAreaGrove, this.countRemainingKeyClues('grove'));
  }

  updateExplorationUi() {
    const count = this.state.evidence.length;
    this.dom.evidenceCount.textContent = count;
    this.dom.evidenceNeededCounter.textContent = `${count} 件`;
    this.updateAreaNavBadges();

    if (this.state.isReadyForDebate()) {
      this.dom.btnGoToDebate.classList.remove('hidden');
      this.dom.exploreStatusText.textContent =
        '🌟 4つの重要ヒントが揃ったよ！「準備OK！猫集会へ乗り込む！」ボタンを押そう！';
      this.dom.exploreStatusText.style.color = '#c84b28';
      return;
    }

    this.dom.btnGoToDebate.classList.add('hidden');
    const areaHints = {
      plaza:
        '【ひだまり広場】🔍ベンチの隙間・花壇・ベンチ裏を調べたり、💬管理人さんやクロにお話を聞こう！',
      grove: '【ケヤキの森】🔍高い木の穴を調べたり、💬ハトのポッポ師匠にお話を聞こう！',
    };
    this.dom.exploreStatusText.textContent = areaHints[this.currentArea] || areaHints.plaza;
    this.dom.exploreStatusText.style.color = '#332722';
  }

  updateEvidenceCounter() {
    this.dom.evidenceCount.textContent = this.state.evidence.length;
  }

  startDebate() {
    this.state.currentPhase = 'DEBATE';
    this.state.life = 3;
    this.state.currentDebateStep = 0;
    this.selectedEvidenceId = null;

    this.dom.hudLoopBadge.textContent = '🐾 猫集会・立証';
    this.dom.hudLifeContainer.classList.remove('hidden');
    this.updateHearts();
    this.showScreen('screenDebate');

    this.renderDebateAvatars('angry', 'normal');

    this.playDialogueQueue(this.scenario.debate.intro, () => {
      this.showDebateStep();
    });
  }

  updateHearts() {
    const full = '❤️'.repeat(Math.max(0, this.state.life));
    const empty = '🖤'.repeat(Math.max(0, 3 - this.state.life));
    this.dom.hudHearts.textContent = full + empty;
  }

  showDebateStep() {
    const stepIdx = this.state.currentDebateStep;
    const totalSteps = this.scenario.debate.steps.length;
    const stepData = this.scenario.debate.steps[stepIdx];

    if (!stepData) {
      this.triggerHappyEnd();
      return;
    }

    const isFinalStep = stepIdx === totalSteps - 1;
    this.dom.debateTurnLabel.textContent = isFinalStep
      ? `最終追及 ${stepIdx + 1} / ${totalSteps}`
      : `問答 ${stepIdx + 1} / ${totalSteps}`;
    this.dom.debateOpponentSpeech.textContent = stepData.opponentQuestion;
    this.dom.debateHintText.textContent = `💡 パムの推理ヒント: ${stepData.hint}`;
    this.audio.speak('トラ吉', stepData.opponentQuestion);

    if (isFinalStep) {
      this.renderDebateAvatars('sweat', 'confident');
    }
    this.renderEvidenceTray();
  }

  getEvidenceBadgeClass(ev, baseClass = 'card-type-badge') {
    if (ev.isTrap) return `${baseClass} trap-badge`;
    if (ev.type.includes('おはなし') || ev.type.includes('証言')) {
      return `${baseClass} testimony`;
    }
    return `${baseClass} key-clue`;
  }

  selectDebateEvidence(evId, ev, card) {
    this.audio.playClick();
    document.querySelectorAll('.evidence-card').forEach((c) => {
      c.classList.remove('selected');
    });
    card.classList.add('selected');
    this.selectedEvidenceId = evId;
    this.dom.selectedEvidencePreview.textContent = ev.name;
    this.dom.btnPresentEvidence.disabled = false;

    if (this.dom.debateSelectedHint) {
      this.dom.debateSelectedHint.textContent = ev.hintText || ev.summary;
      this.dom.debateSelectedHint.classList.toggle('is-trap-hint', Boolean(ev.isTrap));
      this.dom.debateSelectedHint.classList.toggle('is-good-hint', !ev.isTrap);
    }
  }

  renderEvidenceTray() {
    this.dom.debateEvidenceList.innerHTML = '';
    this.selectedEvidenceId = null;
    this.dom.selectedEvidencePreview.textContent = '未選択';
    this.dom.btnPresentEvidence.disabled = true;

    if (this.dom.debateSelectedHint) {
      this.dom.debateSelectedHint.textContent =
        '🐾 下のカードをタップすると、ここに「パムの推理メモ」が表示されるよ！';
      this.dom.debateSelectedHint.classList.remove('is-trap-hint', 'is-good-hint');
    }

    this.state.evidence.forEach((evId) => {
      const ev = this.scenario.evidence[evId];
      if (!ev) return;

      const card = document.createElement('div');
      const cardMod = ['clue-card', 'trap-card'][Number(Boolean(ev.isTrap))];
      card.className = `evidence-card ${cardMod}`;
      const badgeClass = this.getEvidenceBadgeClass(ev, 'card-type-badge');

      card.innerHTML = `
        <div class="card-icon">${ev.icon}</div>
        <div class="card-title">${ev.name}</div>
        <div class="${badgeClass}">${ev.type}</div>
      `;

      card.addEventListener('click', () => {
        this.selectDebateEvidence(evId, ev, card);
      });

      this.dom.debateEvidenceList.appendChild(card);
    });
  }

  isStepEvidenceCorrect(stepData, evId) {
    return (
      evId === stepData.correctEvidenceId ||
      Boolean(
        stepData.alternativeCorrectEvidenceId && evId === stepData.alternativeCorrectEvidenceId,
      )
    );
  }

  evaluateDebatePresentation() {
    const stepIdx = this.state.currentDebateStep;
    const stepData = this.scenario.debate.steps[stepIdx];
    if (!stepData) return;

    if (this.isStepEvidenceCorrect(stepData, this.selectedEvidenceId)) {
      const isFinalStep = stepIdx === this.scenario.debate.steps.length - 1;
      const nextToraMood = ['shock', 'tear'][Number(isFinalStep)];
      this.renderDebateAvatars(nextToraMood, 'confident');
      this.playDialogueQueue(stepData.successReactions, () => {
        this.state.currentDebateStep++;
        this.showDebateStep();
      });
    } else {
      this.handleDebateMistake(stepData, this.selectedEvidenceId);
    }
  }

  handlePresentEvidence() {
    if (!this.selectedEvidenceId) return;
    this.triggerCutin(() => {
      this.evaluateDebatePresentation();
    });
  }

  resolveFailureReactionQueue(stepData, selectedId) {
    const defaultReaction = {
      speaker: 'トラ吉',
      emotion: 'angry',
      text: '「的外れニャ！そんな証拠で俺たちを納得させられると思うなニャ！」',
    };
    const reactions = stepData?.failureReactions || [];
    const specificTrap = reactions.find((r) => r.trapEvidenceId === selectedId);
    const generic = reactions.find((r) => !r.trapEvidenceId);
    const chosen = specificTrap || generic || defaultReaction;

    const queue = [chosen];
    if (stepData?.retryGuide) {
      queue.push({
        speaker: 'パム（心の声）',
        emotion: 'thinking',
        text: stepData.retryGuide,
      });
    }
    return queue;
  }

  handleDebateMistake(stepData, selectedId) {
    this.audio.playDamage();
    this.dom.viewport.classList.add('shake-effect');
    setTimeout(() => this.dom.viewport.classList.remove('shake-effect'), 400);

    this.state.life--;
    this.updateHearts();

    if (this.state.life <= 0) {
      this.renderDebateAvatars('angry', 'sad');
      this.playDialogueQueue(this.scenario.endings.BAD, () => {
        this.triggerBadEnd();
      });
      return;
    }

    const failQueue = this.resolveFailureReactionQueue(stepData, selectedId);
    this.renderDebateAvatars('angry', 'normal');
    this.playDialogueQueue(failQueue, () => {});
  }

  triggerCutin(callback) {
    this.audio.playShout();
    this.dom.overlayCutin.classList.remove('hidden');
    setTimeout(() => {
      this.dom.overlayCutin.classList.add('hidden');
      if (callback) callback();
    }, 700);
  }

  triggerBadEnd() {
    this.state.endingType = 'BAD';
    this.audio.playDamage();
    this.dom.endingIcon.textContent = '🐾';
    this.dom.endingTitle.textContent = 'RETRY';
    this.dom.endingSub.textContent = 'しょんぼりお散歩帰り';
    this.dom.endingDesc.textContent =
      'トラ吉さんをうまく納得させられなかったワン……。でも集めた証拠はそのまま残っているよ！「パムの推理メモ」を見ながらもう一度挑戦しよう！';
    this.dom.endingUnlockedBanner.classList.add('hidden');
    if (this.dom.btnEndingExplore) this.dom.btnEndingExplore.classList.remove('hidden');
    this.dom.btnEndingNext.textContent = '🔄 猫集会にもう一度挑む';
    this.dom.screenEnding.classList.remove('hidden');
  }

  triggerHappyEnd() {
    this.state.endingType = 'HAPPY';
    this.audio.playFanfare();
    this.playDialogueQueue(this.scenario.endings.HAPPY, () => {
      this.state.recordClear('HAPPY');
      this.dom.endingIcon.textContent = '👑';
      this.dom.endingTitle.textContent = 'HAPPY END';
      this.dom.endingSub.textContent = 'おこげ口の英雄と青いお守りの約束';
      this.dom.endingDesc.textContent =
        '消えた座布団の真相は、今日旅立つ子猫たちへの「パムのにおい入りお守り袋」と、大雨の日に泥だらけで命を救ったパムへの「感謝の勲章バンダナ」のサプライズだった！お揃いの青い宝物を胸に、みんなでぽかぽか日向ぼっこ！';
      this.dom.endingUnlockedBanner.classList.remove('hidden');
      this.dom.endingUnlockedBanner.textContent =
        '🏆 事件解決＆真実解明！名探偵パムは「ひだまり公園の名誉ボス犬」になりました！';
      if (this.dom.btnEndingExplore) this.dom.btnEndingExplore.classList.add('hidden');
      this.dom.btnEndingNext.textContent = '🐾 タイトルに戻る';
      this.dom.screenEnding.classList.remove('hidden');
    });
  }

  triggerTrueEnd() {
    this.triggerHappyEnd();
  }

  renderDebateAvatars(toraMood, pomeMood) {
    const moodLabels = {
      shock: '動揺 🙀',
      sweat: '冷や汗 💦',
      tear: '感涙・白状 😿',
    };
    this.dom.opponentStatus.textContent = moodLabels[toraMood] || '威嚇中 😾';
    this.dom.debateToraAvatar.innerHTML = this.character.getMiniAvatarSvg('torakichi', toraMood);
    this.dom.debatePomeAvatar.innerHTML = this.character.getMiniAvatarSvg('pome', pomeMood);
  }

  createEvidenceModalItem(ev) {
    const item = document.createElement('div');
    item.className = 'evidence-detail-item';
    const badgeClass = this.getEvidenceBadgeClass(ev, 'item-badge');
    const memoClass = ['memo-good', 'memo-trap'][Number(Boolean(ev.isTrap))];

    item.innerHTML = `
      <div class="item-icon">${ev.icon}</div>
      <div class="item-info">
        <div class="item-header-row">
          <span class="item-title">${ev.name}</span>
          <span class="${badgeClass}">${ev.type}</span>
        </div>
        <div class="item-desc">${ev.detail}</div>
        <div class="item-hint-memo ${memoClass}">${ev.hintText || ''}</div>
      </div>
    `;
    return item;
  }

  openEvidenceModal() {
    this.dom.modalEvidenceList.innerHTML = '';
    if (this.state.evidence.length === 0) {
      this.dom.modalEvidenceList.innerHTML =
        '<p style="color:#79665c; font-size:14px; text-align:center; padding:20px;">まだ手がかりは見つかっていません。公園を歩いて🔍マークを調べてみよう！</p>';
    } else {
      this.state.evidence.forEach((evId) => {
        const ev = this.scenario.evidence[evId];
        if (ev) {
          this.dom.modalEvidenceList.appendChild(this.createEvidenceModalItem(ev));
        }
      });
    }
    this.dom.modalEvidence.classList.remove('hidden');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.app = new GameApp();
});
