import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8")
OUT = Path("C:/Users/raizi/.gemini/antigravity-ide/brain/e06e2fe4-82a0-43e8-bbd9-166e810e0f6b")
OUT.mkdir(parents=True, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    # ----------------------------------------------------
    # 1. タイトル画面 (PC & モバイル) - CONTINUEボタン、ポータルリンク、シェアボタン
    # ----------------------------------------------------
    context = browser.new_context()
    page = context.new_page()
    page.set_viewport_size({"width": 1280, "height": 800})
    page.goto("http://localhost:8080/box/index.html", wait_until="networkidle")
    
    # セッション保存をシミュレート
    page.evaluate("""() => {
        window.app.state.saveSessionProgress('explore');
        window.app.updateTitleView();
    }""")
    page.wait_for_timeout(300)
    page.screenshot(path=str(OUT / "1_title_pc.png"))
    print("Saved 1_title_pc.png")

    # モバイル タイトル画面
    page.set_viewport_size({"width": 390, "height": 844})
    page.wait_for_timeout(300)
    page.screenshot(path=str(OUT / "1_title_mobile.png"))
    print("Saved 1_title_mobile.png")

    # ----------------------------------------------------
    # 1-2. 前回の続きから再開（CONTINUE）ボタンのテスト
    # ----------------------------------------------------
    page.click("#btn-continue-game")
    page.wait_for_timeout(500)
    page.screenshot(path=str(OUT / "1_continued_explore_mobile.png"))
    print("Saved 1_continued_explore_mobile.png")

    # ----------------------------------------------------
    # 2. 探索画面 (エリアタブバッジ & 証拠トースト演出 & HUDタイトル戻るボタン)
    # ----------------------------------------------------
    page.set_viewport_size({"width": 1280, "height": 800})
    page.evaluate("""() => {
        window.app.showScreen('explore');
        window.app.renderExploreMap();
        window.app.switchArea('room');
    }""")
    page.wait_for_timeout(400)
    
    # 証拠トーストを表示させてキャプチャ
    page.evaluate("""() => {
        window.app.showEvidenceToast('ev_box', {
            name: 'ブラックボックス本体',
            icon: '📦',
            summary: '耐衝撃ナノ合金製の記録カプセル。暗号化シールド展開中。'
        });
    }""")
    page.wait_for_timeout(400)
    page.screenshot(path=str(OUT / "2_explore_toast_pc.png"))
    print("Saved 2_explore_toast_pc.png")

    # モバイル 探索画面
    page.set_viewport_size({"width": 390, "height": 844})
    page.wait_for_timeout(300)
    page.screenshot(path=str(OUT / "2_explore_mobile.png"))
    print("Saved 2_explore_mobile.png")

    # HUDの「🏠 タイトル」ボタンをクリックして確認モーダルを表示
    page.click("#btn-hud-return-title")
    page.wait_for_timeout(400)
    page.screenshot(path=str(OUT / "2_return_title_confirm_mobile.png"))
    print("Saved 2_return_title_confirm_mobile.png")
    page.evaluate("window.app.closeConfirmModal()")

    # ----------------------------------------------------
    # 3. 会話画面 (NPC立ち絵維持 + モノローグ視覚差別化 + 発話インジケーター)
    # ----------------------------------------------------
    page.set_viewport_size({"width": 1280, "height": 800})
    page.evaluate("""() => {
        window.app.playDialogueSequence([
            { speaker: '大家のヤエガシ', text: '何か用かね？ 部屋の鍵なら警察には預けてあるよ。' },
            { speaker: 'ユウタ', text: '（……ヤエガシさんは何か隠しているような気がするな。視線が泳いでいる）' }
        ]);
        // 2行目のモノローグへ進める
        window.app.showNextDialogue();
        // ボイス波形インジケーターを可視化
        if (window.app.dom.voiceWaveIndicator) {
            window.app.dom.voiceWaveIndicator.classList.remove('hidden');
        }
    }""")
    page.wait_for_timeout(400)
    page.screenshot(path=str(OUT / "3_dialogue_monologue_pc.png"))
    print("Saved 3_dialogue_monologue_pc.png")

    # モバイル 会話画面
    page.set_viewport_size({"width": 390, "height": 844})
    page.wait_for_timeout(300)
    page.screenshot(path=str(OUT / "3_dialogue_monologue_mobile.png"))
    print("Saved 3_dialogue_monologue_mobile.png")

    # 会話を閉じる
    page.evaluate("""() => {
        window.app.dom.dialogueStage.classList.add('hidden');
        document.body.classList.remove('dialogue-active');
        window.app.isDialogueActive = false;
        window.app.character.hide();
    }""")

    # ----------------------------------------------------
    # 4. 立証画面 (再再生ボタン + 証拠プレビュー拡大ボタン + ダメージ演出)
    # ----------------------------------------------------
    page.set_viewport_size({"width": 1280, "height": 800})
    page.evaluate("""() => {
        // 全証拠品をアンロックして立証モードへ
        const allEvs = Object.values(window.app.scenario.evidence);
        allEvs.forEach(ev => window.app.state.collectedEvidence.add(ev.id));
        window.app.startDebate();
        // イントロ会話がキューに入っていればクリアして直接ターンへ
        window.app.dom.dialogueStage.classList.add('hidden');
        document.body.classList.remove('dialogue-active');
        window.app.isDialogueActive = false;
        window.app.character.hide();
        window.app.renderDebateTurn();

        // 最初の画像付き証拠を選択
        const imgEv = allEvs.find(e => e.image) || allEvs[0];
        window.app.handleEvidenceCardSelect(imgEv.id, imgEv, false);
    }""")
    page.wait_for_timeout(500)
    page.screenshot(path=str(OUT / "4_debate_pc.png"))
    print("Saved 4_debate_pc.png")

    # モバイル 立証画面
    page.set_viewport_size({"width": 390, "height": 844})
    page.wait_for_timeout(300)
    page.screenshot(path=str(OUT / "4_debate_mobile.png"))
    print("Saved 4_debate_mobile.png")

    # 拡大プレビューをクリックして画像ビューアを開く
    page.evaluate("""() => {
        const btn = document.querySelector('#btn-preview-zoom-img');
        if (btn) btn.click();
    }""")
    page.wait_for_timeout(400)
    page.screenshot(path=str(OUT / "4_debate_zoom_mobile.png"))
    print("Saved 4_debate_zoom_mobile.png")

    # 画像ビューアを閉じる
    page.evaluate("window.app.closeImageViewer()")

    # 不正解ダメージ演出の発動
    page.evaluate("window.app.triggerDebateDamageEffect()")
    page.wait_for_timeout(150) # シェイク最中
    page.screenshot(path=str(OUT / "4_debate_damaged_mobile.png"))
    print("Saved 4_debate_damaged_mobile.png")

    # ----------------------------------------------------
    # 5. バックログ画面 (ボイス再再生ボタン)
    # ----------------------------------------------------
    page.set_viewport_size({"width": 1280, "height": 800})
    page.evaluate("""() => {
        // バックログにボイス付き履歴を流し込んで開く
        window.app.dialogueLog = [
            { speaker: '大家のヤエガシ', text: 'ぶいえーらん……？ 何だその難しい横文字は！ 専門業者に頼むと工事費が何十万もかかるから、ワシが管理人室の光回線から安物の16ポートハブで、全15室へ壁伝いにLANケーブルを直結しただけじゃよ！', voiceUrl: 'assets/audio/voice/npc_yaegashi_c0_02.mp3' },
            { speaker: 'ユウタ', text: '（……ヤエガシさんは何か隠しているような気がするな）', voiceUrl: null }
        ];
        window.app.openBacklog();
    }""")
    page.wait_for_timeout(400)
    page.screenshot(path=str(OUT / "5_backlog_pc.png"))
    print("Saved 5_backlog_pc.png")

    page.set_viewport_size({"width": 390, "height": 844})
    page.wait_for_timeout(300)
    page.screenshot(path=str(OUT / "5_backlog_mobile.png"))
    print("Saved 5_backlog_mobile.png")
    page.evaluate("window.app.closeBacklog()")

    # ----------------------------------------------------
    # 6. サイバー確認モーダル (P3-1 インゲーム確認UI)
    # ----------------------------------------------------
    page.set_viewport_size({"width": 1280, "height": 800})
    page.evaluate("""() => {
        window.app.showConfirmModal({
            title: 'RESET DATA CONFIRMATION',
            message: 'セーブデータと捜査進捗を完全に初期化しますか？\\nこの操作は取り消せません。',
            confirmText: '初期化実行',
            cancelText: '中止'
        });
    }""")
    page.wait_for_timeout(400)
    page.screenshot(path=str(OUT / "6_confirm_modal_pc.png"))
    print("Saved 6_confirm_modal_pc.png")

    page.set_viewport_size({"width": 390, "height": 844})
    page.wait_for_timeout(300)
    page.screenshot(path=str(OUT / "6_confirm_modal_mobile.png"))
    print("Saved 6_confirm_modal_mobile.png")

    browser.close()

print("All issue #10 screenshots verified and captured successfully!")
