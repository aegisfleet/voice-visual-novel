// app.js - メインゲームコントローラー (BOX WORM)

class GameApp {
  constructor() {
    this.audio = window.audioMgr;
    this.state = window.gameState;
    this.scenario = window.SCENARIO_DATA;

    // キャラクター立ち絵コントローラー
    this.character = new BoxCharacterController(
      document.getElementById('character-stage'),
      document.getElementById('emotion-bubble')
    );

    // 会話キュー＆タイピング状態
    this.dialogueQueue = [];
    this.currentDialogueCallback = null;
    this.selectedEvidenceId = null;
    this.isChoiceActive = false;

    this.backlog = [];
    this.isAutoMode = false;
    this.isSkipMode = false;
    this.autoTimer = null;
    this.typewriterTimer = null;
    this.isTyping = false;
    this.currentFullText = '';
    this.currentSpeaker = '';

    // 現在エリア (room | corridor)
    this.currentArea = 'room';

    // DOM要素キャッシュ
    this.dom = {
      viewport: document.getElementById('viewport'),
      hud: document.getElementById('hud'),
      hudLocationBadge: document.getElementById('hud-location-badge'),
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

      // 探索エリア・ナビゲーション
      btnAreaRoom: document.getElementById('btn-area-room'),
      btnAreaCorridor: document.getElementById('btn-area-corridor'),
      areaRoom: document.getElementById('area-room'),
      areaCorridor: document.getElementById('area-corridor'),
      exploreStatusText: document.getElementById('explore-status-text'),
      evidenceNeededCounter: document.getElementById('evidence-needed-counter'),
      btnGoToDebate: document.getElementById('btn-go-to-debate'),

      // 立証
      debateShibataAvatar: document.getElementById('debate-shibata-avatar'),
      debateYutaAvatar: document.getElementById('debate-yuta-avatar'),
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
      cutinText: document.getElementById('cutin-text'),

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

      // バックログ
      modalBacklog: document.getElementById('modal-backlog'),
      modalBacklogList: document.getElementById('modal-backlog-list'),
      btnCloseBacklog: document.getElementById('btn-close-backlog'),
      backdropBacklog: document.getElementById('backdrop-backlog')
    };

    this.bindEvents();
    this.updateTitleView();
  }

  bindEvents() {
    // タイトル操作
    this.dom.btnStartGame.addEventListener('click', () => {
      this.audio.playClick();
      this.audio.startBgm('ambient');
      this.startPrologue();
    });

    this.dom.btnResetSave.addEventListener('click', () => {
      if (confirm('セーブデータを初期化して1周目に戻しますか？')) {
        this.state.resetAllData();
        this.updateTitleView();
        alert('セーブデータを初期化しました。');
      }
    });

    // HUD操作
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

    this.dom.btnEvidenceBag.addEventListener('click', () => {
      this.audio.playClick();
      this.openEvidenceModal();
    });

    this.dom.btnCloseModal.addEventListener('click', () => {
      this.audio.playClick();
      this.dom.modalEvidence.classList.add('hidden');
    });

    // エリア切替
    this.dom.btnAreaRoom.addEventListener('click', () => {
      this.audio.playClick();
      this.switchArea('room');
    });

    this.dom.btnAreaCorridor.addEventListener('click', () => {
      this.audio.playClick();
      this.switchArea('corridor');
    });

    // 立証へ進む
    this.dom.btnGoToDebate.addEventListener('click', () => {
      this.audio.playCutin();
      this.startDebate();
    });

    // 会話ウィンドウ操作（クリックで次へ送り or 即時表示）
    this.dom.novelWindow.addEventListener('click', (e) => {
      if (e.target.closest('.dialogue-ctrl-btn') || e.target.closest('.choice-btn')) return;
      this.handleDialogueProceed();
    });

    this.dom.btnDialogueAuto.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleAutoMode();
    });

    this.dom.btnDialogueSkip.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleSkipMode();
    });

    this.dom.btnDialogueLog.addEventListener('click', (e) => {
      e.stopPropagation();
      this.openBacklog();
    });

    this.dom.btnCloseBacklog.addEventListener('click', () => {
      this.dom.modalBacklog.classList.add('hidden');
    });
    this.dom.backdropBacklog.addEventListener('click', () => {
      this.dom.modalBacklog.classList.add('hidden');
    });

    // 立証パートの証拠突きつけ
    this.dom.btnPresentEvidence.addEventListener('click', () => {
      this.handlePresentEvidence();
    });

    // エンディング後の操作
    this.dom.btnEndingNext.addEventListener('click', () => {
      this.audio.playClick();
      this.returnToTitle();
    });
  }

  // タイトル画面の表示更新
  updateTitleView() {
    const isLoop2 = this.state.isClearedFirstLoop();
    this.dom.hudLoopBadge.textContent = isLoop2 ? '2周目 (深層真実)' : '1周目 (基本捜査)';

    if (isLoop2) {
      this.dom.titleLoopInfo.innerHTML = `
        <span class="loop-tag loop-2">FILE RE-OPEN: 2周目・深層鑑識モード</span>
        <p class="loop-desc">初動の現場確認をクリアしました。2周目では隠された『重みバイナリ』『感染連鎖ログ』を収集でき、強制遮断を阻止してTRUE ENDへ到達できます！</p>
      `;
      this.dom.btnStartGame.textContent = '⚡ 2周目の深層鑑識を開始する';
    } else {
      this.dom.titleLoopInfo.innerHTML = `
        <span class="loop-tag loop-1">1周目: 初動現場確認モード</span>
        <p class="loop-desc">部屋とアパートの電脳鑑識ログを収集し、自分が攻撃者ではなく被害者であることをシバタ捜査官に立証せよ！</p>
      `;
      this.dom.btnStartGame.textContent = '🔍 部屋の現場確認を開始する';
    }

    if (this.state.hasClearedTrueEnd) {
      this.dom.titleClearBadge.classList.remove('hidden');
    } else {
      this.dom.titleClearBadge.classList.add('hidden');
    }
  }

  // 画面遷移
  showScreen(screenName) {
    const screens = [
      this.dom.screenTitle,
      this.dom.screenExplore,
      this.dom.screenDebate,
      this.dom.screenEnding
    ];
    screens.forEach(s => s.classList.remove('active'));

    if (screenName === 'title') {
      this.dom.screenTitle.classList.add('active');
      this.dom.hud.classList.add('hidden');
    } else if (screenName === 'explore') {
      this.dom.screenExplore.classList.add('active');
      this.dom.hud.classList.remove('hidden');
      this.dom.hudLifeContainer.classList.add('hidden');
      this.dom.hudLocationBadge.textContent = this.currentArea === 'room' ? 'ユウタのワンルーム' : 'アパート外廊下';
    } else if (screenName === 'debate') {
      this.dom.screenDebate.classList.add('active');
      this.dom.hud.classList.remove('hidden');
      this.dom.hudLifeContainer.classList.remove('hidden');
      this.dom.hudLocationBadge.textContent = '玄関口・立証対決';
      this.updateHearts();
    } else if (screenName === 'ending') {
      this.dom.screenEnding.classList.add('active');
      this.dom.hud.classList.add('hidden');
    }
  }

  // ライフハート表示更新
  updateHearts() {
    let heartsStr = '';
    for (let i = 0; i < 3; i++) {
      heartsStr += (i < this.state.life) ? '❤️' : '🖤';
    }
    this.dom.hudHearts.textContent = heartsStr;
  }

  // ----------------------------------------------------
  // プロローグ進行
  // ----------------------------------------------------
  startPrologue() {
    this.state.resetTransientState();
    this.showScreen('explore');
    this.renderExploreMap();
    this.updateEvidenceCounter();

    this.playDialogueSequence(this.scenario.prologue, () => {
      // プロローグ終了後、探索モードへ
      this.audio.playPacketPulse();
    });
  }

  // ----------------------------------------------------
  // 探索パート
  // ----------------------------------------------------
  switchArea(area) {
    this.currentArea = area;
    if (area === 'room') {
      this.dom.areaRoom.classList.remove('hidden');
      this.dom.areaCorridor.classList.add('hidden');
      this.dom.btnAreaRoom.classList.add('active');
      this.dom.btnAreaCorridor.classList.remove('active');
      this.dom.hudLocationBadge.textContent = 'ユウタのワンルーム';
    } else {
      this.dom.areaRoom.classList.add('hidden');
      this.dom.areaCorridor.classList.remove('hidden');
      this.dom.btnAreaRoom.classList.remove('active');
      this.dom.btnAreaCorridor.classList.add('active');
      this.dom.hudLocationBadge.textContent = 'アパート外廊下';
    }
  }

  renderExploreMap() {
    // スポットとNPCのDOM要素を動的生成
    const renderItems = (container, area) => {
      container.innerHTML = '';

      // スポット
      const spots = this.scenario.spots.filter(s => s.area === area);
      spots.forEach(spot => {
        // 2周目限定スポットの判定
        if (spot.isSecretLoop2 && !this.state.isClearedFirstLoop()) {
          return;
        }

        const el = document.createElement('div');
        el.className = `explore-pin spot-pin ${this.state.isSpotInspected(spot.id) ? 'inspected' : ''}`;
        el.style.left = `${spot.coords.x}%`;
        el.style.top = `${spot.coords.y}%`;
        el.innerHTML = `
          <div class="pin-icon">${spot.icon}</div>
          <div class="pin-label">${spot.name}</div>
        `;
        el.addEventListener('click', () => {
          this.handleInspectSpot(spot);
        });
        container.appendChild(el);
      });

      // NPC
      const npcs = this.scenario.npcs.filter(n => n.area === area);
      npcs.forEach(npc => {
        const el = document.createElement('div');
        el.className = `explore-pin npc-pin ${this.state.isNpcTalked(npc.id) ? 'talked' : ''}`;
        el.style.left = `${npc.coords.x}%`;
        el.style.top = `${npc.coords.y}%`;
        el.innerHTML = `
          <div class="pin-icon">${npc.icon}</div>
          <div class="pin-label">${npc.name}</div>
        `;
        el.addEventListener('click', () => {
          this.handleTalkNpc(npc);
        });
        container.appendChild(el);
      });
    };

    renderItems(this.dom.areaRoom, 'room');
    renderItems(this.dom.areaCorridor, 'corridor');
  }

  // スポット調査処理
  handleInspectSpot(spot) {
    this.audio.playClick();
    this.state.markSpotInspected(spot.id);

    this.playDialogueSequence(spot.inspectText, () => {
      if (spot.evidenceId) {
        const isNew = this.state.addEvidence(spot.evidenceId);
        if (isNew) {
          this.audio.playFound();
        }
        this.updateEvidenceCounter();
      }
      this.renderExploreMap();
    });
  }

  // NPC会話処理
  handleTalkNpc(npc) {
    this.audio.playClick();
    this.state.markNpcTalked(npc.id);

    const introQueue = [...npc.dialogue.intro];
    this.playDialogueSequence(introQueue, () => {
      // 選択肢表示
      this.showChoiceMenu(npc.dialogue.choices, (chosenChoice) => {
        this.playDialogueSequence(chosenChoice.responses, () => {
          if (chosenChoice.giveEvidence) {
            const isNew = this.state.addEvidence(chosenChoice.giveEvidence);
            if (isNew) {
              this.audio.playFound();
            }
            this.updateEvidenceCounter();
          }
          this.renderExploreMap();
        });
      });
    });
  }

  // 証拠カウンタ・立証ボタン有効化判定
  updateEvidenceCounter() {
    const count = this.state.collectedEvidence.size;
    this.dom.evidenceCount.textContent = count;

    // 立証に必要な証拠数（最低3個）
    const required = 3;
    if (count >= required) {
      this.dom.btnGoToDebate.classList.remove('hidden');
      this.dom.exploreStatusText.textContent = `⚖️ 鑑識データが揃った！ (${count}件) シバタ捜査官に客観的反証を提示できるぞ！`;
      this.dom.evidenceNeededCounter.textContent = '提示可能！';
    } else {
      this.dom.btnGoToDebate.classList.add('hidden');
      this.dom.exploreStatusText.textContent = `部屋やアパートを調べて鑑識データを集めよう（あと${required - count}件必要）`;
      this.dom.evidenceNeededCounter.textContent = `${count} / ${required}`;
    }
  }

  // ----------------------------------------------------
  // 会話・ノベルウィンドウ演出 (タイピング & 音声)
  // ----------------------------------------------------
  playDialogueSequence(dialogueList, onComplete = null) {
    this.dialogueQueue = [...dialogueList];
    this.currentDialogueCallback = onComplete;
    this.dom.dialogueStage.classList.remove('hidden');
    this.showNextDialogue();
  }

  showNextDialogue() {
    if (this.dialogueQueue.length === 0) {
      this.dom.dialogueStage.classList.add('hidden');
      this.character.hide();
      if (this.currentDialogueCallback) {
        const cb = this.currentDialogueCallback;
        this.currentDialogueCallback = null;
        cb();
      }
      return;
    }

    const currentItem = this.dialogueQueue.shift();
    this.character.showForDialogue(currentItem);

    this.currentSpeaker = currentItem.speaker || 'ナレーション';
    this.currentFullText = currentItem.text || '';

    // バックログ記録
    this.backlog.push({ speaker: this.currentSpeaker, text: this.currentFullText });

    this.dom.dialogueSpeaker.textContent = this.currentSpeaker;
    this.dom.dialogueChoices.classList.add('hidden');
    this.dom.dialogueChoices.innerHTML = '';

    // 音声読み上げ
    this.audio.speak(this.currentSpeaker, this.currentFullText);

    // タイピング演出
    this.startTypewriter(this.currentFullText, currentItem.speaker);
  }

  startTypewriter(text, speaker) {
    clearInterval(this.typewriterTimer);
    clearTimeout(this.autoTimer);
    this.isTyping = true;
    this.dom.dialogueText.textContent = '';
    this.dom.dialoguePrompt.classList.add('hidden');

    let charIdx = 0;
    // 0.39トークンの遅さをMIMIのセリフ時に演出
    const isMimi = speaker && (speaker.includes('MIMI') || speaker.includes('知性'));
    const speed = isMimi ? 120 : (this.isSkipMode ? 5 : 25);

    this.typewriterTimer = setInterval(() => {
      if (charIdx < text.length) {
        this.dom.dialogueText.textContent += text[charIdx];
        charIdx++;
      } else {
        this.finishTyping();
      }
    }, speed);
  }

  finishTyping() {
    clearInterval(this.typewriterTimer);
    this.isTyping = false;
    this.dom.dialogueText.textContent = this.currentFullText;
    this.dom.dialoguePrompt.classList.remove('hidden');

    if (this.isAutoMode || this.isSkipMode) {
      const waitTime = this.isSkipMode ? 80 : 1800;
      this.autoTimer = setTimeout(() => {
        if (!this.isChoiceActive) {
          this.showNextDialogue();
        }
      }, waitTime);
    }
  }

  handleDialogueProceed() {
    if (this.isChoiceActive) return;

    if (this.isTyping) {
      // タイピング中なら一瞬で全文表示
      this.finishTyping();
    } else {
      this.audio.playClick();
      this.showNextDialogue();
    }
  }

  // 選択肢メニュー表示
  showChoiceMenu(choices, onSelect) {
    this.isChoiceActive = true;
    this.dom.dialoguePrompt.classList.add('hidden');
    this.dom.dialogueChoices.classList.remove('hidden');
    this.dom.dialogueChoices.innerHTML = '';

    choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = choice.text;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.audio.playClick();
        this.isChoiceActive = false;
        this.dom.dialogueChoices.classList.add('hidden');
        this.dom.dialogueChoices.innerHTML = '';
        onSelect(choice);
      });
      this.dom.dialogueChoices.appendChild(btn);
    });
  }

  toggleAutoMode() {
    this.isAutoMode = !this.isAutoMode;
    this.dom.btnDialogueAuto.classList.toggle('active', this.isAutoMode);
    if (this.isAutoMode && !this.isTyping && !this.isChoiceActive) {
      this.showNextDialogue();
    }
  }

  toggleSkipMode() {
    this.isSkipMode = !this.isSkipMode;
    this.dom.btnDialogueSkip.classList.toggle('active', this.isSkipMode);
    if (this.isSkipMode && !this.isChoiceActive) {
      this.handleDialogueProceed();
    }
  }

  openBacklog() {
    this.dom.modalBacklogList.innerHTML = '';
    this.backlog.forEach(item => {
      const div = document.createElement('div');
      div.className = 'backlog-item';
      div.innerHTML = `
        <div class="backlog-speaker">${item.speaker}</div>
        <div class="backlog-text">${item.text}</div>
      `;
      this.dom.modalBacklogList.appendChild(div);
    });
    this.dom.modalBacklog.classList.remove('hidden');
    this.dom.modalBacklogList.scrollTop = this.dom.modalBacklogList.scrollHeight;
  }

  // ----------------------------------------------------
  // 立証パート（シバタ捜査官との論戦対決）
  // ----------------------------------------------------
  startDebate() {
    this.state.currentDebateStep = 0;
    this.state.life = 3;
    this.audio.startBgm('tension');
    this.showScreen('debate');

    // イントロ会話再生
    this.playDialogueSequence(this.scenario.debate.intro, () => {
      this.renderDebateTurn();
    });
  }

  getDebateSteps() {
    // 2周目なら stepsLoop2、1周目なら stepsLoop1
    return this.state.isClearedFirstLoop()
      ? this.scenario.debate.stepsLoop2
      : this.scenario.debate.stepsLoop1;
  }

  renderDebateTurn() {
    const steps = this.getDebateSteps();
    const currentStep = steps[this.state.currentDebateStep];

    if (!currentStep) {
      // 全問クリア！
      this.handleDebateVictory();
      return;
    }

    this.selectedEvidenceId = null;
    this.dom.btnPresentEvidence.disabled = true;
    this.dom.selectedEvidencePreview.textContent = '提示する鑑識データを手帳から選択してください';

    this.dom.debateTurnLabel.textContent = `問答 ${currentStep.questionNumber} / ${steps.length}`;
    this.dom.debateOpponentSpeech.textContent = currentStep.opponentQuestion;
    this.dom.debateHintText.textContent = `💡 鑑識ポイント: ${currentStep.hint}`;

    // 相手の発言を読み上げ
    this.audio.speak('シバタ捜査官', currentStep.opponentQuestion);

    // 所持証拠一覧をレンダリング
    this.renderDebateEvidenceList();
  }

  renderDebateEvidenceList() {
    this.dom.debateEvidenceList.innerHTML = '';
    const collected = Array.from(this.state.collectedEvidence);

    collected.forEach(evId => {
      const ev = this.scenario.evidence[evId];
      if (!ev) return;

      const card = document.createElement('div');
      card.className = `debate-evidence-card ${this.selectedEvidenceId === evId ? 'selected' : ''}`;
      card.innerHTML = `
        <div class="evidence-icon">${ev.icon}</div>
        <div class="evidence-info">
          <div class="evidence-name">${ev.name}</div>
          <div class="evidence-type">${ev.type}</div>
        </div>
      `;
      card.addEventListener('click', () => {
        this.audio.playClick();
        this.selectedEvidenceId = evId;
        this.dom.btnPresentEvidence.disabled = false;
        this.dom.selectedEvidencePreview.innerHTML = `<strong>選択中:</strong> ${ev.icon} ${ev.name}（${ev.summary}）`;
        this.renderDebateEvidenceList();
      });
      this.dom.debateEvidenceList.appendChild(card);
    });
  }

  handlePresentEvidence() {
    if (!this.selectedEvidenceId) return;

    const steps = this.getDebateSteps();
    const currentStep = steps[this.state.currentDebateStep];
    const isCorrect = (this.selectedEvidenceId === currentStep.correctEvidenceId);

    if (isCorrect) {
      // 正解演出！カットイン
      this.triggerCutin('客観的反証があります！', () => {
        this.playDialogueSequence(currentStep.successReactions, () => {
          this.state.currentDebateStep++;
          this.renderDebateTurn();
        });
      });
    } else {
      // 失敗演出！ショック音＆ハート減少
      this.audio.playShock();
      const remainLife = this.state.decreaseLife();
      this.updateHearts();

      // 囮証拠に対する専用リアクションがあるか探す
      let reactionList = currentStep.failureReactions;
      const trapReaction = currentStep.failureReactions.find(r => r.trapEvidenceId === this.selectedEvidenceId);
      if (trapReaction) {
        reactionList = [trapReaction];
      }

      this.playDialogueSequence(reactionList, () => {
        if (remainLife <= 0) {
          // BAD END へ
          this.handleDebateGameOver();
        } else {
          // リトライ
          this.renderDebateTurn();
        }
      });
    }
  }

  // 異議ありカットイン演出
  triggerCutin(text, callback) {
    this.audio.playCutin();
    this.dom.cutinText.textContent = text;
    this.dom.overlayCutin.classList.remove('hidden');
    this.dom.overlayCutin.classList.add('active');

    setTimeout(() => {
      this.dom.overlayCutin.classList.remove('active');
      this.dom.overlayCutin.classList.add('hidden');
      if (callback) callback();
    }, 1100);
  }

  // 立証勝利
  handleDebateVictory() {
    const isLoop2 = this.state.isClearedFirstLoop();
    this.audio.startBgm('truth');

    if (isLoop2) {
      // TRUE END
      this.state.markTrueEndCleared();
      this.showEnding(this.scenario.endings.true);
    } else {
      // NORMAL END (1周目クリア)
      this.state.markLoop1Cleared();
      this.showEnding(this.scenario.endings.normal);
    }
  }

  // 立証失敗 (ライフ0)
  handleDebateGameOver() {
    this.audio.stopBgm();
    this.showEnding(this.scenario.endings.bad);
  }

  // ----------------------------------------------------
  // エンディング画面
  // ----------------------------------------------------
  showEnding(endingData) {
    this.showScreen('ending');

    this.dom.endingTitle.textContent = endingData.title;
    this.dom.endingSub.textContent = endingData.sub;
    this.dom.endingDesc.textContent = endingData.desc;

    if (endingData.type === 'normal') {
      this.dom.endingIcon.textContent = '⛅';
      this.dom.endingUnlockedBanner.classList.remove('hidden');
      this.dom.endingUnlockedBanner.textContent = '🎉 1周目クリア！【2周目：深層真実ルート】が解放されました！';
      this.dom.btnEndingNext.textContent = 'タイトル画面へ戻る (2周目を開始)';
    } else if (endingData.type === 'true') {
      this.dom.endingIcon.textContent = '🌟';
      this.dom.endingUnlockedBanner.classList.remove('hidden');
      this.dom.endingUnlockedBanner.textContent = '🏆 祝・TRUE END達成！ 0.39トークンの知性は僕たちの街を守る盾となった！';
      this.dom.btnEndingNext.textContent = 'タイトル画面へ戻る';
    } else {
      this.dom.endingIcon.textContent = '💀';
      this.dom.endingUnlockedBanner.classList.add('hidden');
      this.dom.btnEndingNext.textContent = '立証をやり直す (リトライ)';
    }

    // 読み上げ
    this.audio.speak('ナレーション', endingData.title + '。' + endingData.desc);
  }

  returnToTitle() {
    this.audio.stopBgm();
    this.updateTitleView();
    this.showScreen('title');
  }

  // 証拠手帳モーダル
  openEvidenceModal() {
    this.dom.modalEvidenceList.innerHTML = '';
    const collected = Array.from(this.state.collectedEvidence);

    if (collected.length === 0) {
      this.dom.modalEvidenceList.innerHTML = '<p class="empty-note">まだ証拠品はありません。部屋やアパートを調査しましょう。</p>';
    } else {
      collected.forEach(evId => {
        const ev = this.scenario.evidence[evId];
        if (!ev) return;

        const item = document.createElement('div');
        item.className = 'evidence-modal-item';
        item.innerHTML = `
          <div class="evidence-modal-header">
            <span class="ev-icon">${ev.icon}</span>
            <span class="ev-name">${ev.name}</span>
            <span class="ev-badge">${ev.type}</span>
          </div>
          <p class="ev-summary">${ev.summary}</p>
          <p class="ev-detail">${ev.detail}</p>
        `;
        this.dom.modalEvidenceList.appendChild(item);
      });
    }

    this.dom.modalEvidence.classList.remove('hidden');
  }
}

// 起動
window.addEventListener('DOMContentLoaded', () => {
  window.app = new GameApp();
});
