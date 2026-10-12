// app.js - メインゲームコントローラ（本格ミステリー＆NPC会話選択肢対応版）

class GameApp {
  constructor() {
    this.audio = window.audioMgr;
    this.state = window.gameState;
    this.scenario = window.SCENARIO_DATA;

    // キャラクター立ち絵コントローラー (eveスタイル)
    this.character = new PomeCharacterController(
      document.getElementById('character-stage'),
      document.getElementById('emotion-bubble')
    );

    // 現在進行中のノベル会話キュー＆状態
    this.dialogueQueue = [];
    this.currentDialogueCallback = null;
    this.selectedEvidenceId = null;
    this.isChoiceActive = false;

    // タイピング表示・AUTO・SKIP・バックログ管理
    this.backlog = [];
    this.isAutoMode = false;
    this.isSkipMode = false;
    this.autoTimer = null;
    this.typewriterTimer = null;
    this.isTyping = false;
    this.currentFullText = '';
    this.currentSpeaker = '';

    // DOM要素のキャッシュ
    this.dom = {
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

      // 画面
      screenTitle: document.getElementById('screen-title'),
      screenExplore: document.getElementById('screen-explore'),
      screenDebate: document.getElementById('screen-debate'),
      screenEnding: document.getElementById('screen-ending'),

      // タイトル
      titleLoopInfo: document.getElementById('title-loop-info'),
      titleClearBadge: document.getElementById('title-clear-badge'),
      btnStartGame: document.getElementById('btn-start-game'),
      btnResetSave: document.getElementById('btn-reset-save'),

      // 探索・2エリアシステム
      areaNavPlaza: document.getElementById('btn-area-plaza'),
      areaNavGrove: document.getElementById('btn-area-grove'),
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

      // 立証
      debateToraAvatar: document.getElementById('debate-tora-avatar'),
      debatePomeAvatar: document.getElementById('debate-pome-avatar'),
      opponentStatus: document.getElementById('opponent-status'),
      debateTurnLabel: document.getElementById('debate-turn-label'),
      debateOpponentSpeech: document.getElementById('debate-opponent-speech'),
      debateHintText: document.getElementById('debate-hint-text'),
      selectedEvidencePreview: document.getElementById('selected-evidence-preview'),
      debateEvidenceList: document.getElementById('debate-evidence-list'),
      btnPresentEvidence: document.getElementById('btn-present-evidence'),
      debateSpeedlines: document.getElementById('debate-speedlines'),

      // 会話ステージ＆ノベルウィンドウ
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

      // カットイン
      overlayCutin: document.getElementById('overlay-cutin'),

      // エンディング
      endingIcon: document.getElementById('ending-icon'),
      endingTitle: document.getElementById('ending-title'),
      endingSub: document.getElementById('ending-sub'),
      endingDesc: document.getElementById('ending-desc'),
      endingUnlockedBanner: document.getElementById('ending-unlocked-banner'),
      btnEndingNext: document.getElementById('btn-ending-next'),

      // モーダル
      modalEvidence: document.getElementById('modal-evidence'),
      modalEvidenceList: document.getElementById('modal-evidence-list'),
      btnCloseModal: document.getElementById('btn-close-modal'),

      // バックログモーダル
      modalBacklog: document.getElementById('modal-backlog'),
      modalBacklogList: document.getElementById('modal-backlog-list'),
      btnCloseBacklog: document.getElementById('btn-close-backlog'),
      backdropBacklog: document.getElementById('backdrop-backlog')
    };

    this.currentArea = 'plaza';

    this.bindEvents();
    this.updateTitleView();
  }

  bindEvents() {
    // タイトル操作
    this.dom.btnStartGame.addEventListener('click', () => {
      this.audio.playClick();
      this.audio.startBgm();
      this.startPrologue();
    });

    this.dom.btnResetSave.addEventListener('click', () => {
      if (confirm('セーブデータを初期化して1周目に戻しますか？')) {
        this.state.resetAllData();
        this.updateTitleView();
        alert('セーブデータを初期化しました。');
      }
    });

    // HUD トグル
    this.dom.btnToggleVoice.addEventListener('click', () => {
      const active = this.audio.toggleVoice();
      this.state.voiceEnabled = active;
      this.state.savePersistentState();
      this.dom.btnToggleVoice.textContent = active ? '🗣️ 音声: ON' : '🗣️ 音声: OFF';
    });

    this.dom.btnToggleSe.addEventListener('click', () => {
      const active = this.audio.toggleSe();
      this.state.seEnabled = active;
      this.state.savePersistentState();
      this.dom.btnToggleSe.textContent = active ? '🔔 SE: ON' : '🔔 SE: OFF';
    });

    this.dom.btnToggleBgm.addEventListener('click', () => {
      const active = this.audio.toggleBgm();
      this.state.bgmEnabled = active;
      this.state.savePersistentState();
      this.dom.btnToggleBgm.textContent = active ? '🎵 BGM: ON' : '🎵 BGM: OFF';
    });

    // 2エリア切り替えナビゲーション
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

    // 証拠手帳モーダル
    this.dom.btnEvidenceBag.addEventListener('click', () => {
      this.audio.playClick();
      this.openEvidenceModal();
    });
    this.dom.btnCloseModal.addEventListener('click', () => {
      this.audio.playClick();
      this.dom.modalEvidence.classList.add('hidden');
    });

    // 会話コントロールボタン
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

    // バックログモーダルを閉じる
    this.dom.btnCloseBacklog.addEventListener('click', () => {
      this.audio.playClick();
      this.closeBacklogModal();
    });
    this.dom.backdropBacklog.addEventListener('click', () => {
      this.closeBacklogModal();
    });

    // 会話ウィンドウクリック（タイピング中なら即時完了、完了後なら次へ）
    this.dom.novelWindow.addEventListener('click', (e) => {
      if (this.isChoiceActive) return; // 選択肢表示中はクリック送り不可
      if (e.target.closest('.novel-ctrl-btn') || e.target.closest('.dialogue-choice-btn')) return;

      if (this.isTyping) {
        this.finishTyping();
      } else {
        this.advanceDialogue();
      }
    });

    // 探索スポットクリック
    const spots = document.querySelectorAll('.spot-object');
    spots.forEach(el => {
      el.addEventListener('click', (e) => {
        const spotId = el.getAttribute('data-spot');
        this.handleSpotClick(spotId, el);
      });
    });

    // NPCアクタークリック
    const npcs = document.querySelectorAll('.npc-actor');
    npcs.forEach(el => {
      el.addEventListener('click', (e) => {
        const npcId = el.getAttribute('data-npc');
        this.handleNpcClick(npcId, el);
      });
    });

    // 猫集会へ乗り込む
    this.dom.btnGoToDebate.addEventListener('click', () => {
      this.audio.playBark();
      this.startDebate();
    });

    // 証拠提出
    this.dom.btnPresentEvidence.addEventListener('click', () => {
      this.handlePresentEvidence();
    });

    // エンディング次へ
    this.dom.btnEndingNext.addEventListener('click', () => {
      this.audio.playClick();
      this.dom.screenEnding.classList.add('hidden');
      this.showScreen('screenTitle');
      this.dom.hud.classList.add('hidden');
      this.updateTitleView();
    });
  }

  showScreen(screenKey) {
    ['screenTitle', 'screenExplore', 'screenDebate'].forEach(k => {
      if (this.dom[k]) this.dom[k].classList.remove('active');
    });
    if (this.dom[screenKey]) {
      this.dom[screenKey].classList.add('active');
    }
  }

  updateTitleView() {
    const isSecondLoop = this.state.isSecondLoopOrLater();
    if (isSecondLoop) {
      this.dom.titleLoopInfo.textContent = `🌟 名探偵モード（${this.state.clearCount + 1}周目）- 2周目隠しルート解放中！`;
      this.dom.titleLoopInfo.style.background = '#ffe8d6';
      this.dom.titleLoopInfo.style.color = '#a0522d';
    } else {
      this.dom.titleLoopInfo.textContent = '✨ はじめての捜査（1周目）';
    }

    if (this.state.trueEndUnlocked) {
      this.dom.titleClearBadge.classList.remove('hidden');
    } else {
      this.dom.titleClearBadge.classList.add('hidden');
    }

    this.audio.voiceEnabled = this.state.voiceEnabled;
    this.audio.seEnabled = this.state.seEnabled;
    this.audio.bgmEnabled = this.state.bgmEnabled;
    this.dom.btnToggleVoice.textContent = this.state.voiceEnabled ? '🗣️ 音声: ON' : '🗣️ 音声: OFF';
    this.dom.btnToggleSe.textContent = this.state.seEnabled ? '🔔 SE: ON' : '🔔 SE: OFF';
    this.dom.btnToggleBgm.textContent = this.state.bgmEnabled ? '🎵 BGM: ON' : '🎵 BGM: OFF';
  }

  // --------------------------------------
  // 会話・ノベルウィンドウ制御 (eveスタイル・センター立ち絵連動)
  // --------------------------------------
  playDialogueQueue(queue, callback) {
    this.dialogueQueue = [...queue];
    this.currentDialogueCallback = callback || null;
    this.isChoiceActive = false;
    this.dom.dialogueChoices.classList.add('hidden');
    this.dom.dialoguePrompt.classList.remove('hidden');

    // 背景ビネット＆センターステージを表示
    this.dom.dialogueBackdrop.classList.remove('hidden');
    this.dom.dialogueStage.classList.remove('hidden');
    this.dom.novelWindow.classList.remove('hidden');

    this.advanceDialogue();
  }

  advanceDialogue() {
    clearTimeout(this.typewriterTimer);
    clearTimeout(this.autoTimer);

    if (this.dialogueQueue.length === 0) {
      this.audio.stopSpeech();
      this.stopAutoMode();

      // コールバックがある場合（選択肢や次の会話へ続く場合）はウィンドウを閉じずに処理を引き継ぐ
      if (this.currentDialogueCallback) {
        const cb = this.currentDialogueCallback;
        this.currentDialogueCallback = null;
        cb();
        return;
      }

      // コールバックがない場合のみ完全クローズ
      this.character.hide();
      this.dom.dialogueBackdrop.classList.add('hidden');
      this.dom.dialogueStage.classList.add('hidden');
      this.dom.novelWindow.classList.add('hidden');
      return;
    }

    const current = this.dialogueQueue.shift();
    this.currentSpeaker = current.speaker;
    this.currentFullText = current.text;

    // 1. キャラクターをセンターに表示（表情・エモーション連動）
    this.character.showForDialogue(current);

    // 2. 話者アイコンとスピーカータグの更新
    this.updateSpeakerDisplay(current.speaker);

    // 3. バックログに記録
    this.backlog.push({ speaker: current.speaker, text: current.text });

    // 4. 音声読み上げ
    this.audio.speak(current.speaker, current.text);

    // 5. タイピング演出開始
    this.startTypewriter(current.text);
  }

  // タイピング表示（一文字ずつ表示、口パク連動）
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
    const speed = 24; // 1文字あたりのミリ秒

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

  // タイピング即時完了
  finishTyping() {
    clearTimeout(this.typewriterTimer);
    this.isTyping = false;
    this.dom.dialogueText.textContent = this.currentFullText;
    this.character.stopTalking();

    // AUTOモード時の自動次へ処理
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

  // 話者表示（アイコン＆スタイル）の更新
  updateSpeakerDisplay(speaker) {
    this.dom.dialogueSpeaker.textContent = speaker;
    let icon = '🐾';
    let tagClass = 'speaker-tag';

    if (speaker.includes('ポメ')) {
      icon = '🐶';
      tagClass = 'speaker-tag pome-speaker';
    } else if (speaker.includes('トラ吉')) {
      icon = '😼';
      tagClass = 'speaker-tag tora-speaker';
    } else if (speaker.includes('管理人')) {
      icon = '👴';
      tagClass = 'speaker-tag npc-speaker';
    } else if (speaker.includes('ポッポ')) {
      icon = '🕊️';
      tagClass = 'speaker-tag npc-speaker';
    } else if (speaker.includes('クロ')) {
      icon = '🐈‍⬛';
      tagClass = 'speaker-tag kuro-speaker';
    } else if (speaker.includes('シマリス') || speaker.includes('チビ')) {
      icon = '🐿️';
      tagClass = 'speaker-tag npc-speaker';
    } else if (speaker.includes('子猫')) {
      icon = '🐱';
      tagClass = 'speaker-tag npc-speaker';
    } else if (speaker.includes('ナレーション')) {
      icon = '📖';
      tagClass = 'speaker-tag narrator-speaker';
    }

    this.dom.dialogueSpeakerIcon.textContent = icon;
    this.dom.dialogueSpeaker.className = tagClass;
  }

  // AUTOモード切替
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

  // SKIPモード切替
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

  // バックログモーダルの表示
  openBacklogModal() {
    this.dom.modalBacklogList.innerHTML = '';
    if (this.backlog.length === 0) {
      this.dom.modalBacklogList.innerHTML = '<p style="text-align:center; color:#79665c; padding:20px;">まだ会話履歴はありません。</p>';
    } else {
      this.backlog.forEach(item => {
        const div = document.createElement('div');
        div.className = 'backlog-item';
        div.innerHTML = `
          <span class="backlog-item-speaker">${item.speaker}</span>
          <span class="backlog-item-text">${item.text}</span>
        `;
        this.dom.modalBacklogList.appendChild(div);
      });
      // 一番下までスクロール
      setTimeout(() => {
        this.dom.modalBacklogList.scrollTop = this.dom.modalBacklogList.scrollHeight;
      }, 50);
    }
    this.dom.modalBacklog.classList.remove('hidden');
  }

  closeBacklogModal() {
    this.dom.modalBacklog.classList.add('hidden');
  }

  // 選択肢の表示
  showChoices(choices, onSelect) {
    this.isChoiceActive = true;
    this.dom.dialogueBackdrop.classList.remove('hidden');
    this.dom.dialogueStage.classList.remove('hidden');
    this.dom.novelWindow.classList.remove('hidden');
    this.dom.dialoguePrompt.classList.add('hidden');
    this.dom.dialogueChoices.innerHTML = '';
    this.dom.dialogueChoices.classList.remove('hidden');

    choices.forEach(ch => {
      const btn = document.createElement('button');
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

  // --------------------------------------
  // プロローグ
  // --------------------------------------
  startPrologue() {
    this.state.resetTransientState();
    this.dom.hud.classList.remove('hidden');
    this.dom.hudLifeContainer.classList.add('hidden');
    this.dom.hudLoopBadge.textContent = this.state.isSecondLoopOrLater() ? `${this.state.clearCount + 1}周目` : '1周目';
    this.updateEvidenceCounter();

    this.playDialogueQueue(this.scenario.prologue, () => {
      this.startExploration();
    });
  }

  // --------------------------------------
  // 探索パート（2エリア行き来システム）
  // --------------------------------------
  startExploration() {
    this.state.currentPhase = 'EXPLORATION';
    this.showScreen('screenExplore');
    this.switchArea('plaza');

    // 2周目以降なら隠しスポットを表示
    if (this.state.isSecondLoopOrLater()) {
      this.dom.spotSecretBush.classList.remove('hidden');
    } else {
      this.dom.spotSecretBush.classList.add('hidden');
    }

    this.updateExplorationUi();
  }

  // エリア切り替え（ひだまり広場 ⇔ ケヤキの森）
  switchArea(areaKey) {
    this.currentArea = areaKey;
    this.audio.playClick();

    const isPlaza = (areaKey === 'plaza');
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

    const locationBadge = document.getElementById('hud-location-badge');
    if (locationBadge) {
      locationBadge.textContent = isPlaza ? '🐾 ひだまり広場' : '🌲 ケヤキの森';
    }

    // ポメの位置をエリア移動に合わせて自然に初期化
    if (this.dom.pomeWalker) {
      this.dom.pomeWalker.style.left = isPlaza ? '22%' : '30%';
      this.dom.pomeWalker.style.top = isPlaza ? '68%' : '66%';
    }

    this.updateExplorationUi();
  }

  // スポット調査処理
  handleSpotClick(spotId, element) {
    if (this.state.currentPhase !== 'EXPLORATION' || this.isChoiceActive) return;

    this.moveWalkerTo(element);

    const spotData = this.scenario.spots.find(s => s.id === spotId);
    if (!spotData) return;

    this.audio.playBark();

    this.playDialogueQueue(spotData.inspectText, () => {
      if (spotData.evidenceId) {
        const isNew = this.state.addEvidence(spotData.evidenceId);
        if (isNew) {
          this.audio.playFound();
        }
      }
      this.state.markSpotExamined(spotId);
      this.updateExplorationUi();
    });
  }

  // NPC対話処理（選択肢イベント）
  handleNpcClick(npcId, element) {
    if (this.state.currentPhase !== 'EXPLORATION' || this.isChoiceActive) return;

    this.moveWalkerTo(element);

    const npcData = this.scenario.npcs.find(n => n.id === npcId);
    if (!npcData) return;

    this.audio.playBark();

    // イントロセリフ再生後、選択肢を表示
    this.playDialogueQueue(npcData.dialogue.intro, () => {
      this.showChoices(npcData.dialogue.choices, (chosen) => {
        // 選択された回答を再生
        this.playDialogueQueue(chosen.responses, () => {
          if (chosen.giveEvidence) {
            const isNew = this.state.addEvidence(chosen.giveEvidence);
            if (isNew) {
              this.audio.playFound();
            }
          }
          this.state.markSpotExamined(npcId);
          this.updateExplorationUi();
        });
      });
    });
  }

  moveWalkerTo(element) {
    const rect = element.getBoundingClientRect();
    const mapRect = this.dom.parkMap.getBoundingClientRect();
    const leftPercent = ((rect.left - mapRect.left + rect.width / 2) / mapRect.width) * 100;
    const topPercent = ((rect.top - mapRect.top + rect.height / 2) / mapRect.height) * 100;

    this.dom.pomeWalker.style.left = `${Math.max(8, Math.min(88, leftPercent - 4))}%`;
    this.dom.pomeWalker.style.top = `${Math.max(25, Math.min(82, topPercent + 6))}%`;
  }

  updateExplorationUi() {
    const count = this.state.evidence.length;
    this.dom.evidenceCount.textContent = count;
    this.dom.evidenceNeededCounter.textContent = `${count} 件`;

    if (this.state.isReadyForDebate()) {
      this.dom.btnGoToDebate.classList.remove('hidden');
      this.dom.exploreStatusText.textContent = '主要な3つの論点を突く証拠が揃った！「猫集会へ乗り込む」で真相を暴こう！';
      this.dom.exploreStatusText.style.color = '#e76f51';
    } else {
      this.dom.btnGoToDebate.classList.add('hidden');
      if (this.currentArea === 'plaza') {
        this.dom.exploreStatusText.textContent = '【ひだまり広場】ベンチ周辺や花壇、ゴミ箱を調査したり、管理人さんやクロに話を聞こう！';
      } else {
        this.dom.exploreStatusText.textContent = '【ケヤキの森】高くそびえるケヤキの木や水飲み場を調査したり、ポッポ師匠に話を聞こう！';
      }
      this.dom.exploreStatusText.style.color = '#332722';
    }
  }

  updateEvidenceCounter() {
    this.dom.evidenceCount.textContent = this.state.evidence.length;
  }

  // --------------------------------------
  // 立証パート（猫集会・本格論戦対決）
  // --------------------------------------
  startDebate() {
    this.state.currentPhase = 'DEBATE';
    this.state.life = 3;
    this.state.currentDebateStep = 0;
    this.selectedEvidenceId = null;

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
    const stepData = this.scenario.debate.steps[stepIdx];

    if (!stepData) {
      // 3問突破！2周目隠しルートの判定
      if (this.state.isSecondLoopOrLater() && this.state.hasEvidence('kitten_ribbon')) {
        this.showSecretDebateStep();
      } else {
        this.triggerHappyEnd();
      }
      return;
    }

    this.dom.debateTurnLabel.textContent = `問答 ${stepIdx + 1} / 3`;
    this.dom.debateOpponentSpeech.textContent = stepData.opponentQuestion;
    this.dom.debateHintText.textContent = `💡 ヒント: ${stepData.hint}`;
    this.audio.speak('トラ吉', stepData.opponentQuestion);

    this.renderEvidenceTray();
  }

  showSecretDebateStep() {
    const secret = this.scenario.debate.secretStep;
    this.dom.debateTurnLabel.textContent = '最終追及：隠された真実';
    this.dom.debateOpponentSpeech.textContent = secret.opponentQuestion;
    this.dom.debateHintText.textContent = `💡 ヒント: ${secret.hint}`;
    this.audio.speak('トラ吉', secret.opponentQuestion);

    this.renderDebateAvatars('sweat', 'confident');
    this.renderEvidenceTray(true);
  }

  renderEvidenceTray(isSecret = false) {
    this.dom.debateEvidenceList.innerHTML = '';
    this.selectedEvidenceId = null;
    this.dom.selectedEvidencePreview.textContent = '未選択';
    this.dom.btnPresentEvidence.disabled = true;

    this.state.evidence.forEach(evId => {
      const ev = this.scenario.evidence[evId];
      if (!ev) return;

      const card = document.createElement('div');
      card.className = 'evidence-card';
      const badgeClass = ev.type.includes('証言') ? 'card-type-badge testimony' : 'card-type-badge';

      card.innerHTML = `
        <div class="card-icon">${ev.icon}</div>
        <div class="card-title">${ev.name}</div>
        <div class="${badgeClass}">${ev.type}</div>
      `;

      card.addEventListener('click', () => {
        this.audio.playClick();
        document.querySelectorAll('.evidence-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.selectedEvidenceId = evId;
        this.dom.selectedEvidencePreview.textContent = ev.name;
        this.dom.btnPresentEvidence.disabled = false;
      });

      this.dom.debateEvidenceList.appendChild(card);
    });
  }

  handlePresentEvidence() {
    if (!this.selectedEvidenceId) return;

    this.triggerCutin(() => {
      const stepIdx = this.state.currentDebateStep;
      const isSecret = (stepIdx >= 3);

      if (isSecret) {
        if (this.selectedEvidenceId === 'kitten_ribbon') {
          this.renderDebateAvatars('shock', 'confident');
          this.playDialogueQueue(this.scenario.debate.secretStep.successReactions, () => {
            this.triggerTrueEnd();
          });
        } else {
          this.handleDebateMistake();
        }
      } else {
        const stepData = this.scenario.debate.steps[stepIdx];
        const isCorrect = (this.selectedEvidenceId === stepData.correctEvidenceId) ||
                          (stepData.alternativeCorrectEvidenceId && this.selectedEvidenceId === stepData.alternativeCorrectEvidenceId);

        if (isCorrect) {
          this.renderDebateAvatars('shock', 'confident');
          this.playDialogueQueue(stepData.successReactions, () => {
            this.state.currentDebateStep++;
            this.showDebateStep();
          });
        } else {
          this.handleDebateMistake(stepData, this.selectedEvidenceId);
        }
      }
    });
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
    } else {
      let failReactions = [
        { speaker: 'トラ吉', emotion: 'angry', text: '「的外れニャ！そんな証拠で俺たちを言いくるめられると思うなニャ！」' }
      ];

      if (stepData && stepData.failureReactions) {
        const specificTrap = stepData.failureReactions.find(r => r.trapEvidenceId === selectedId);
        if (specificTrap) {
          failReactions = [specificTrap];
        } else {
          const generic = stepData.failureReactions.find(r => !r.trapEvidenceId);
          if (generic) failReactions = [generic];
        }
      }

      this.renderDebateAvatars('angry', 'normal');
      this.playDialogueQueue(failReactions, () => {
        // 再度同じ問答
      });
    }
  }

  triggerCutin(callback) {
    this.audio.playShout();
    this.dom.overlayCutin.classList.remove('hidden');
    setTimeout(() => {
      this.dom.overlayCutin.classList.add('hidden');
      if (callback) callback();
    }, 700);
  }

  // --------------------------------------
  // エンディング
  // --------------------------------------
  triggerBadEnd() {
    this.audio.playDamage();
    this.dom.endingIcon.textContent = '😿';
    this.dom.endingTitle.textContent = 'BAD END';
    this.dom.endingSub.textContent = 'しょんぼりお散歩帰り';
    this.dom.endingDesc.textContent = 'トラ吉の追及を論理的に崩せず、公園から退散してしまったポメ……。証拠の説明をよく読んで、もう一度リベンジしよう！';
    this.dom.endingUnlockedBanner.classList.add('hidden');
    this.dom.btnEndingNext.textContent = '🔄 もう一度挑戦する';
    this.dom.screenEnding.classList.remove('hidden');
  }

  triggerHappyEnd() {
    this.audio.playFanfare();
    this.playDialogueQueue(this.scenario.endings.HAPPY, () => {
      this.state.recordClear('HAPPY');
      this.dom.endingIcon.textContent = '🎉';
      this.dom.endingTitle.textContent = 'HAPPY END';
      this.dom.endingSub.textContent = 'ひだまりの和解';
      this.dom.endingDesc.textContent = '犯人はシマリスのチビちゃんだった！誤解が解けて犬と猫が仲直り。ベンチで一緒にぽかぽか日向ぼっこ！';
      this.dom.endingUnlockedBanner.classList.remove('hidden');
      this.dom.endingUnlockedBanner.textContent = '✨ 【2周目：名探偵モード】が解禁！公園の奥で新たな真実が……！？';
      this.dom.btnEndingNext.textContent = '🌟 タイトルに戻る（2周目解放）';
      this.dom.screenEnding.classList.remove('hidden');
    });
  }

  triggerTrueEnd() {
    this.audio.playFanfare();
    this.playDialogueQueue(this.scenario.endings.TRUE, () => {
      this.state.recordClear('TRUE');
      this.dom.endingIcon.textContent = '👑';
      this.dom.endingTitle.textContent = 'TRUE END';
      this.dom.endingSub.textContent = 'もふもふレスキュー隊';
      this.dom.endingDesc.textContent = 'トラ吉の秘密と子猫たちを守り抜き、ポメは公園の「名誉ボス犬」に任命！犬も猫もみんな家族になった最高の結末！';
      this.dom.endingUnlockedBanner.classList.remove('hidden');
      this.dom.endingUnlockedBanner.textContent = '🏆 全シナリオ完全制覇！おめでとうございます！';
      this.dom.btnEndingNext.textContent = '🐾 タイトルに戻る';
      this.dom.screenEnding.classList.remove('hidden');
    });
  }

  // アバター描画
  renderDebateAvatars(toraMood, pomeMood) {
    let toraEyes = '<polygon points="72,75 88,78 75,86" fill="#ffe066" stroke="#2d1c14" stroke-width="2" /><ellipse cx="80" cy="80" rx="2.5" ry="5" fill="#2d1c14" /><polygon points="128,75 112,78 125,86" fill="#ffe066" stroke="#2d1c14" stroke-width="2" /><ellipse cx="120" cy="80" rx="2.5" ry="5" fill="#2d1c14" />';
    let toraDecor = '';

    if (toraMood === 'shock') {
      toraEyes = '<circle cx="78" cy="80" r="10" fill="#ffffff" stroke="#2d1c14" stroke-width="2"/><circle cx="78" cy="80" r="3" fill="#2d1c14"/><circle cx="122" cy="80" r="10" fill="#ffffff" stroke="#2d1c14" stroke-width="2"/><circle cx="122" cy="80" r="3" fill="#2d1c14"/>';
      toraDecor = '<path d="M 60 40 L 70 50 M 140 40 L 130 50" stroke="#00b4d8" stroke-width="4"/>';
      this.dom.opponentStatus.textContent = '動揺 🙀';
    } else if (toraMood === 'sweat') {
      toraDecor = '<text x="145" y="60" font-size="28">💧</text>';
      this.dom.opponentStatus.textContent = '冷や汗 💦';
    } else if (toraMood === 'tear') {
      toraDecor = '<text x="65" y="95" font-size="20">💧</text><text x="120" y="95" font-size="20">💧</text>';
      this.dom.opponentStatus.textContent = '降参・白状 😿';
    } else {
      this.dom.opponentStatus.textContent = '威嚇中 😾';
    }

    this.dom.debateToraAvatar.innerHTML = `
      <svg viewBox="0 0 200 200">
        <ellipse cx="100" cy="130" rx="55" ry="50" fill="#e69d45" stroke="#ba681b" stroke-width="3" />
        <ellipse cx="100" cy="80" rx="46" ry="40" fill="#e69d45" stroke="#ba681b" stroke-width="3" />
        <polygon points="55,50 65,15 88,48" fill="#e69d45" stroke="#ba681b" stroke-width="3" />
        <polygon points="112,48 135,15 145,50" fill="#e69d45" stroke="#ba681b" stroke-width="3" />
        ${toraEyes}
        ${toraDecor}
        <polygon points="75,115 125,115 100,138" fill="#e63946" stroke="#ba1826" stroke-width="2" />
      </svg>
    `;

    this.dom.debatePomeAvatar.innerHTML = `
      <svg viewBox="0 0 200 200">
        <ellipse cx="100" cy="130" rx="65" ry="55" fill="#ffffff" stroke="#f0e6d2" stroke-width="3" />
        <circle cx="100" cy="85" r="50" fill="#ffffff" stroke="#f0e6d2" stroke-width="3" />
        <polygon points="62,55 78,15 95,58" fill="#fceadc" stroke="#f0e6d2" stroke-width="3" />
        <polygon points="105,58 122,15 138,55" fill="#fceadc" stroke="#f0e6d2" stroke-width="3" />
        <ellipse cx="78" cy="82" rx="7" ry="9" fill="#2d1c14" />
        <circle cx="76" cy="79" r="3" fill="#ffffff" />
        <ellipse cx="122" cy="82" rx="7" ry="9" fill="#2d1c14" />
        <circle cx="120" cy="79" r="3" fill="#ffffff" />
        <ellipse cx="100" cy="96" rx="6" ry="5" fill="#2d1c14" />
        <circle cx="75" cy="98" r="10" fill="#ffccd5" opacity="0.6" />
        <circle cx="125" cy="98" r="10" fill="#ffccd5" opacity="0.6" />
      </svg>
    `;
  }

  // 証拠手帳モーダル
  openEvidenceModal() {
    this.dom.modalEvidenceList.innerHTML = '';
    if (this.state.evidence.length === 0) {
      this.dom.modalEvidenceList.innerHTML = '<p style="color:#79665c; font-size:14px; text-align:center; padding:20px;">まだ証拠品は見つかっていません。公園を散歩して調査してみよう！</p>';
    } else {
      this.state.evidence.forEach(evId => {
        const ev = this.scenario.evidence[evId];
        if (!ev) return;
        const item = document.createElement('div');
        item.className = 'evidence-detail-item';
        const badgeClass = ev.type.includes('証言') ? 'item-badge testimony' : 'item-badge';

        item.innerHTML = `
          <div class="item-icon">${ev.icon}</div>
          <div class="item-info">
            <div class="item-header-row">
              <span class="item-title">${ev.name}</span>
              <span class="${badgeClass}">${ev.type}</span>
            </div>
            <div class="item-desc">${ev.detail}</div>
          </div>
        `;
        this.dom.modalEvidenceList.appendChild(item);
      });
    }
    this.dom.modalEvidence.classList.remove('hidden');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.app = new GameApp();
});
