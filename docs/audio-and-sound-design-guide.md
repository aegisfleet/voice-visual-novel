# WebノベルゲームにおけるAI音響生成・サウンドデザイン設計書 (SFX & BGM)

本ドキュメントは、AI電脳クライムノベルADV『BOX WORM 〜55ドルの自己増殖知性〜』および『PROJECT EVE』における**効果音（SFX）およびBGMのAI生成技術、音響心理設計、およびWeb Audio API実装アーキテクチャ**の完全な記録である。

---

## 1. AI効果音（SFX）生成モデルの現状と選定指針

### 1.1 主要モデルとプラットフォームの現状

| プラットフォーム / モデル | 特徴・適用領域 | 利用可否・ステータス |
| :--- | :--- | :--- |
| **Google DeepMind Lyria 3** (`lyria-3-clip-preview`) | 音楽およびシネマティック音響テクスチャ生成に特化。プロンプト設計と波形スライス処理により**迫力あるシネマティックSE（激突音・チャイム）**の制作が可能。 | **利用可能**（Vertex AI Interactions API） |
| **Google Research (AudioLM / SoundStorm / V2A)** | テキストや映像から短尺の環境音・フォーリー効果音を直接生成する研究モデル。 | **API未提供**（2026年10月現在、Vertex AIでは一般公開されていない） |
| **ElevenLabs Sound Effects API** | 1〜10秒のワンショット効果音を生成する専用プロプライエタリAPI。 | **要外部契約**（サードパーティ有料APIのため本プロジェクトでは不採用） |
| **Web Audio API (プロシージャル合成)** | ブラウザ標準のオシレーター・ノイズバッファ・フィルターによる**遅延ゼロ（0ms）**の音響合成。 | **完全無償・即時利用可能**（全ブラウザ対応） |

### 1.2 ノベルゲームにおける効果音の必須要件

1. **発音レイテンシ・ゼロ（0ms即時性）**:
   クリックや決定、カットインの瞬間に音が出遅れると、プレイヤーの没入感と快感が著しく損なわれる。
2. **ネットワーク障害・CORS制約への耐性**:
   外部ファイルのロード遅延や通信切断時でも、ゲーム進行を絶対に止めず音を鳴らし続ける必要がある。
3. **音圧と周波数のクリアさ**:
   キャラクターのボイス（セリフ読み上げ）と周波数が衝突せず、かつ効果音自体が埋もれないメリハリ。

---

## 2. Lyria 3 を活用したシネマティック効果音生成パイプライン

Lyria 3 は約30秒のオーディオクリップを生成するため、ワンショット効果音として使用するには**「プロンプト設計」と「Pythonによる波形スライス・成形処理」**を組み合わせる。

### 2.1 効果音プロンプト設計指針

「音楽」を生成させず「効果音のみ」を出力させるため、プロンプトには以下の制約を明記する：
* **末尾のネガティブ指定**: `sound effect only, no background music, no melodic chords`
* **音響的アタックと質感**: `massive sub-bass drop, sharp metallic cyber slice, clean decaying reverb tail`
* **用途と世界観**: `courtroom objection strike, high-tech digital notification chime`

#### 採用されたプロンプト例

1. **カットイン論破激突音 (`sfx_cutin.mp3`)**:
   ```
   A dramatic cinematic anime impact sound effect, massive sub-bass drop, sharp metallic cyber slice, powerful courtroom objection strike, dramatic cinematic punch with clean decaying reverb tail, sound effect only, no background music
   ```
2. **証拠獲得サイバーチャイム (`sfx_evidence.mp3`)**:
   ```
   A clean high-tech digital notification sound effect, futuristic cyber discovery chime, crystal clear ascending two-tone interface chime, holographic data acquisition confirmation, pristine studio UI sound design, sound effect only, no music
   ```

### 2.2 波形スライス・エンベロープ加工アルゴリズム (Python)

生成された30秒クリップから、最大ピーク（アタック）を検出し、自然な余韻（ディケイ）を含めて切り出す：

```python
import wave
import numpy as np
import subprocess
from pathlib import Path

def extract_sfx_clip(wav_in: Path, wav_out: Path, pre_roll_sec: float = 0.03, duration_sec: float = 2.0, fade_out_sec: float = 0.4):
    with wave.open(str(wav_in), 'rb') as wf:
        params = wf.getparams()
        framerate = wf.getframerate()
        raw = wf.readframes(wf.getnframes())

    audio = np.frombuffer(raw, dtype=np.int16).reshape(-1, 2).astype(np.float32)

    # 1. 瞬時RMSエネルギーの最大ピーク位置を探索
    rms = np.sqrt(np.mean(audio**2, axis=1))
    peak_idx = np.argmax(rms)

    # 2. ピーク直前のプリロールを含めて切り出し
    start_frame = max(0, peak_idx - int(pre_roll_sec * framerate))
    end_frame = min(len(audio), start_frame + int(duration_sec * framerate))
    clip = audio[start_frame:end_frame].copy()

    # 3. 末尾を滑らかな余弦カーブで完全無音へフェードアウト
    fade_frames = int(fade_out_sec * framerate)
    t = np.linspace(0.0, 1.0, fade_frames)[:, np.newaxis]
    clip[-fade_frames:] *= 0.5 * (1.0 + np.cos(np.pi * t))

    # 4. 書き出し
    clip_int = np.clip(clip, -32768, 32767).astype(np.int16)
    with wave.open(str(wav_out), 'wb') as wf:
        wf.setparams(params)
        wf.setnframes(len(clip_int))
        wf.writeframes(clip_int.tobytes())
```

---

## 3. Web Audio API とのハイブリッド効果音アーキテクチャ

ネットワーク遅延による発音ズレやブラウザブロックを完全回避するため、**高音質MP3優先再生 ＋ Web Audio API シンセ合成フォールバック**の二重化を採用する。

```javascript
// box/js/audio.js におけるハイブリッド実装例
playCutin() {
  if (!this.seEnabled) return;
  this.ensureContext();

  try {
    // 1. 高音質シネマティックMP3の即時再生を試行
    const audio = new Audio('assets/audio/sfx_cutin.mp3');
    audio.volume = 0.8;
    audio.play().catch(() => this._playSynthCutin());
  } catch (_e) {
    // 2. ロード失敗時は即座にWeb Audio APIで合成再生
    this._playSynthCutin();
  }
}

// 0msレイテンシ保証のWeb Audio APIフォールバック合成
_playSynthCutin() {
  if (!this.ctx) return;
  const now = this.ctx.currentTime;

  // 低音サブベースインパクト (150Hz -> 35Hz 急速指数減衰)
  const subOsc = this.ctx.createOscillator();
  const subGain = this.ctx.createGain();
  subOsc.type = 'sawtooth';
  subOsc.frequency.setValueAtTime(150, now);
  subOsc.frequency.exponentialRampToValueAtTime(35, now + 0.4);
  subGain.gain.setValueAtTime(0.35, now);
  subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
  subOsc.connect(subGain);
  subGain.connect(this.ctx.destination);
  subOsc.start(now);
  subOsc.stop(now + 0.4);

  // 金属クラッシュノイズ (バンドパスフィルター Q=3, 3200Hz)
  const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.3, this.ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseBuffer.length; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  const noise = this.ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  const filter = this.ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(3200, now);
  filter.Q.setValueAtTime(3, now);
  const noiseGain = this.ctx.createGain();
  noiseGain.gain.setValueAtTime(0.25, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(this.ctx.destination);
  noise.start(now);
}
```

### 3.3 証拠品獲得チャイム（ピロン♪）の音響工学・4パターン設計

ADVゲームにおいて、プレイヤーが現場で証拠品を発見・取得した瞬間のSEは「達成感」「ひらめき」「ゲームのテンポ」を決定づける最重要サウンドである。
単調なビープ音ではなく、自然な減衰特性（Exponential Decay）と音楽的倍音構造（Harmonics）を持つ以下の4パターンを物理合成し提供している：

| パターン | 音源名 | 音階・音程構造 | 倍音構成・音響特性 | ゲーム演出効果 |
| :--- | :--- | :--- | :--- | :--- |
| **パターンB【ゲーム内正式採用】** | `sfx_evidence_b.mp3`<br>（`sfx_evidence.mp3` に適用） | **E6 (1319Hz) $\to$ G#6 (1661Hz) $\to$ B6 (1976Hz)**<br>長3和音アルペジオ（3音） | セレスタ／グロッケンシュピール倍音（急減衰アタック＋長減衰サステイン） | **爽やかピロリン♪**。きらめく音粒が駆け上がり、重要な手がかりや決定打を発見した知的好奇心を心地よく刺激。 |
| **パターンA** | `sfx_evidence_a.mp3` | **D6 (1175Hz) $\to$ A6 (1760Hz)**<br>完全5度上行（2音） | クリスタルガラス倍音（基音1.0, 2次0.25, 3次0.1, 4.2次0.05） | **王道ピロン♪**。最も爽快感と直感的快楽原則が高く、耳馴染みの良いクラシックな発見音。 |
| **パターンC** | `sfx_evidence_c.mp3` | **C#6 (1109Hz) $\to$ F#6 (1480Hz)**<br>完全4度上行（2音） | 非整数倍音（3.1次、4.5次）を含むハイテクメタル構造 | **電脳サイバー・ピロン♪**。電子基板やARホログラムUIとシンクロする先鋭的かつソリッドなSFX。 |
| **パターンD** | `sfx_evidence_d.mp3` | **A5 (880Hz) $\to$ E6 (1319Hz)**<br>完全5度上行（2音） | 奇数倍音を抑えた温かいフェルト・ベル構造 | **優しいソフト・ピロン♪**。高域の金属的刺激を排除し、長時間の探索でも聴き疲れしない親和性。 |

* **生成ツール**: [`scripts/generate_piron_sfx.py`](file:///d:/Work/voice-visual-novel/scripts/generate_piron_sfx.py)
* **マスタリングと音量最適化**:
  * 証拠品SE: EBU R128（-19.0 LUFS, TP -0.5dB）により、BGM（-18.0 LUFS）やセリフ読み上げに対して出しゃばりすぎず、耳に優しく上品な音圧に設定。ゲーム内再生ボリュームも `0.45` に調整。
  * カットイン激突音: サブベースとメタリッククラッシュの音圧を -4.5dB 減衰し、ゲーム内再生ボリュームを `0.45`（旧 0.8）に抑制。劇的な衝撃感を保ちながら耳への刺激を大幅に緩和。
* **試聴・切り替え**: [`box/samples.html`](file:///d:/Work/voice-visual-novel/box/samples.html) の「シネマティック効果音 (SFX)」セクションにて全4パターンの比較試聴が可能。

---

## 4. BGM冒頭の違和感解消（ソフトS字フェードイン）

### 4.1 違和感の原因
シームレスループ加工では末尾の余韻を先頭に畳み込むため、**0.0秒から楽器がフルボリュームで鳴っている**。そのため、曲の頭出し（再生開始時）に突然アタック音が飛び出し、プレイヤーに「唐突さ」「ブツ切り感」という違和感を与える。

### 4.2 解決策：二重ソフトフェードイン構造

1. **ファイル自体の先頭ソフトS字フェードイン (1.0秒)**:
   ```python
   # create_beat_aligned_seamless_loop 内
   head_fade_frames = int(head_fade_in_sec * framerate)
   if head_fade_frames > 0 and head_fade_frames < len(extended):
       t_head = np.linspace(0.0, 1.0, head_fade_frames)[:, np.newaxis]
       s_curve = 0.5 * (1.0 - np.cos(np.pi * t_head))  # Smooth S-curve (0.0 -> 1.0)
       extended[:head_fade_frames] *= s_curve
   ```
   * 先頭0.0秒の振幅を完全ゼロから滑らかなS字曲線で立ち上げる。
   * ループ周回境界はタイリングされているため、曲の演奏中のシームレス性は損なわれない。

2. **ゲームエンジンの動的クロスフェードイン (1.2秒)**:
   * シーン遷移時に Web Audio API の `GainNode.linearRampToValueAtTime(1.0, now + 1.2)` および `HTMLAudioElement.volume` のタイマー制御を多重に適用。
   * 前の曲のフェードアウト（1.0秒）と美しく重なり合いながら、新しい曲がシルクのように立ち上がる。

---

## 5. シーン別BGMと世界観調和の設計原則

AI音楽生成において、プロンプトの単語選定はゲームジャンルとの調和を左右する最大の要因である：

| NGワード（不協和音・ジャンル崩壊の原因） | 推奨ワード（本格電脳サスペンスの調和） | 理由・効果 |
| :--- | :--- | :--- |
| `ambient`, `drone`, `minimal IDM` | `poignant acoustic grand piano, expressive solo cello` | 無調のビープ音や電子音の羅列を排し、人間味のある美しい旋律を創出 |
| `glitch`, `harsh synth arpeggio` | `clear electric piano, precision electronic ticking` | 耳障りなノイズを排し、知的な電脳鑑識の集中力を加速 |
| `jazz`, `walking upright bass`, `marimba` | `deep clean synth bass groove, atmospheric cyber strings` | 探偵BAR風のズレを排し、本格サイバーサスペンスの緊迫感に統一 |
| `dissonant jump`, `sudden drop` | `rich romantic harmonic progression in D minor / C minor` | 調性感・和声美を厳守し、何十回ループしても聴き疲れしない安定性 |

---

## 6. LINE内ブラウザおよびiOS WKWebViewにおけるボイス再生設計

WebノベルゲームをSNS（特にLINEやX）経由で配信・共有する際、**「BGMは鳴るのにキャラクターの音声だけ鳴らない」**という重大な音声再生障害が発生しやすい。本セクションでは、その根本原因と確立された完全解決アーキテクチャを記録する。

### 6.1 WebKit（iOS / LINE内ブラウザ）における4大トラップ

1. **Web Speech API 初期化時のフラグ誤爆（最大の盲点）**:
   ```javascript
   // ❌ 過去の致命的アンチパターン
   initSpeech() {
     if (!('speechSynthesis' in window)) {
       this.voiceEnabled = false; // ← LINE内ブラウザ等で録音済みMP3ボイスまで全停止する！
     }
   }
   ```
   * iOS LINEアプリ内ブラウザ（WKWebView）では `window.speechSynthesis` が利用できない環境が多い。
   * ここで `voiceEnabled`（ユーザーの音声ON/OFF設定）を `false` に倒してしまうと、**録音済みMP3ボイスの再生パイプラインまで完全にブロックされる**。BGMは別フラグ（`bgmEnabled`）のため鳴り、「BGMだけ鳴って声が出ない」原因となる。
   * **解決策**: `speechSynthesisAvailable` のみ管理し、`this.voiceEnabled` は常にユーザー設定として保護する。

2. **24kHz MPEG-2 MP3 に対する `decodeAudioData` の拒絶**:
   * 音声合成TTS（Edge TTSやGoogle Cloud TTS等）から出力されるMP3ボイスは、**24,000Hz (24kHz) モノラル・MPEG-2 Layer 3** 形式であることが多い。
   * iOS WebKit の `AudioContext.decodeAudioData` は 44.1kHz / 48kHz（MPEG-1 Layer 3）しか受け付けず、24kHz MP3 を渡すと `EncodingError: The string did not match the expected pattern.` を投げて失敗する。

3. **非同期境界跨ぎによる User Gesture Token（操作権限）の失効**:
   * WebKit では、ユーザーのタップ/クリックイベントハンドラ内で同期的に呼び出された `Audio.play()` のみが再生を許可される。
   * `await fetch()` や `await decodeAudioData()` などの非同期タスク境界を跨いだ後のフォールバックで `new Audio().play()` を呼んでも、**User Gesture Token が失効しているため `NotAllowedError` で確実に拒絶**される。

4. **`createMediaElementSource` の無音化バグ**:
   * iOS WKWebView では `audioContext.createMediaElementSource(audio)` を接続すると、WebKit の内部バグ（Bug 168239 / 197464）および CORS 制限により音声出力が強制的に 0（完全無音）になる。

### 6.2 確立されたボイス再生アーキテクチャ（同期直接再生パイプライン）

以上の制約をすべてクリアするため、ボイス再生は **「単一 `HTMLAudioElement` の再利用 ＋ 同期直接再生」** に一本化する。

```javascript
// box/js/audio.js における確立された実装構造
class AudioManager {
  constructor() {
    this.voiceAudio = typeof Audio !== 'undefined' ? new Audio() : null;
    if (this.voiceAudio) this.voiceAudio.preload = 'auto';
    this.currentVoiceAudio = null;
    this.playSessionId = 0;
  }

  // ユーザーのタップ/クリック時に非同期待機を挟まず同期的に呼び出す
  playVoiceFile(url, options = {}) {
    if (this.isVoicePlaybackBlocked(url, options)) return;
    this.stopVoice();

    const sessionId = ++this.playSessionId;
    const audio = this.voiceAudio || new Audio();
    this.currentVoiceAudio = audio;

    this.executeDirectVoicePlay(audio, url, options, sessionId);
  }

  executeDirectVoicePlay(audio, url, options, sessionId) {
    audio.onended = () => this.handleVoiceEnded(audio, options, sessionId);
    audio.onerror = (e) => this.handleVoiceLoadError(url, options, sessionId, e);

    audio.src = url;
    try { audio.currentTime = 0; } catch (_e) {}

    // WebKitのUser Gesture Tokenが有効な瞬間に同期的にplay()を発火
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => this.handleVoicePlaySuccess(audio, options, sessionId))
        .catch((err) => this.handleVoicePlayFailure(err, options, sessionId));
    }
  }
}
```

* ネイティブのメディアプレーヤーエンジン（AVFoundation）は 24kHz MPEG-2 MP3 を完全にサポートしているため、デコードエラーを起こさず即座に鳴動する。
* セッションID（`playSessionId`）により、セリフスキップや連打時の競合・過去コールバックの暴走を確実にシャットアウトする。

### 6.3 LINEアプリ内ブラウザ（物理消音モード）の回避導線

* **物理マナーモード問題**: iOS LINE アプリ内ブラウザの `AVAudioSession` は `ambient` 設定のため、端末側面の「消音スイッチ（マナーモード）」が ON の場合、JavaScript の工夫に関わらず OS レベルで全音声が消音される。
* **解決策**: LINE アプリ内ブラウザを検知（`/Line\//i.test(navigator.userAgent)`）した際、タイトル画面に **「🌐 Safari / 外部ブラウザで開く（推奨）」ボタン** を自動表示する。
  ```html
  <a href="?openExternalBrowser=1" class="btn-external-browser" target="_blank" rel="noopener">
    🌐 Safari / 外部ブラウザで開く（推奨）
  </a>
  ```
* LINE アプリ内ブラウザは URL に `?openExternalBrowser=1` が含まれるリンクを踏むと、LINE を抜けて自動的に OS 標準ブラウザ（iOS: Safari / Android: Chrome）を起動する。Safari であればマナーモード時でもメディア音量に応じて音声が再生されるため、最高の体験を提供できる。

---

## 7. 関連ファイル一覧

* **BGM・効果音生成スクリプト**: [`scripts/generate_box_bgm.py`](file:///d:/Work/voice-visual-novel/scripts/generate_box_bgm.py)
* **ピロン効果音（SFX）物理合成スクリプト**: [`scripts/generate_piron_sfx.py`](file:///d:/Work/voice-visual-novel/scripts/generate_piron_sfx.py)
* **ゲームオーディオ制御エンジン**: [`box/js/audio.js`](file:///d:/Work/voice-visual-novel/box/js/audio.js)
* **ゲーム内メイン制御**: [`box/js/app.js`](file:///d:/Work/voice-visual-novel/box/js/app.js)
* **試聴・音響アーカイブ室**: [`box/samples.html`](file:///d:/Work/voice-visual-novel/box/samples.html)
* **作品仕様書**: [`box/README.md`](file:///d:/Work/voice-visual-novel/box/README.md)
* **AIエージェント開発プロトコル**: [`docs/agent-novel-game-dev-protocol.md`](file:///d:/Work/voice-visual-novel/docs/agent-novel-game-dev-protocol.md)
* **BGM制作ガイドライン（全タイトル共通の標準方針）**: [`docs/bgm-production-guide.md`](file:///d:/Work/voice-visual-novel/docs/bgm-production-guide.md)

