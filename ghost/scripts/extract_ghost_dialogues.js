// ghost/scripts/extract_ghost_dialogues.js
// scenario.js から全セリフを抽出し、音声生成用の安定したID・パスを持つJSONを出力する。
const fs = require('node:fs');
const path = require('node:path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const SCENARIO_PATH = path.join(REPO_ROOT, 'ghost', 'js', 'scenario.js');
const OUTPUT_PATH = path.join(__dirname, 'all_dialogues.json');

function loadScenario() {
  const code = fs.readFileSync(SCENARIO_PATH, 'utf8');
  const factory = new Function('window', `${code}; return window.SCENARIO_DATA;`);
  return factory({});
}

function pad2(number) {
  return String(number).padStart(2, '0');
}

function collectLines(lines, prefix, entries, seen) {
  if (!Array.isArray(lines)) return;
  lines.forEach((line, index) => {
    if (!line || typeof line.text !== 'string' || !line.speaker) return;
    if (seen.has(line)) return;
    seen.add(line);

    const id = `${prefix}_${pad2(index + 1)}`;
    if (entries.some((entry) => entry.id === id)) {
      throw new Error(`Duplicate dialogue id detected: ${id}`);
    }

    entries.push({
      id,
      speaker: line.speaker,
      text: line.text,
      file: line.voiceUrl || `assets/audio/voice/${id}.mp3`,
      existingVoiceUrl: line.voiceUrl || null,
    });
  });
}

function collectChoiceSteps(steps, prefix, entries, seen) {
  if (!Array.isArray(steps)) return;
  steps.forEach((step, stepIndex) => {
    const stepPrefix = `${prefix}_s${stepIndex + 1}`;
    collectLines(step.reaction, `${stepPrefix}_reaction`, entries, seen);
    collectLines(step.nextDialogue, `${stepPrefix}_next`, entries, seen);

    if (!Array.isArray(step.options)) return;
    step.options.forEach((option, optionIndex) => {
      const optionPrefix = `${stepPrefix}_opt${optionIndex + 1}`;
      collectLines(option.reaction, `${optionPrefix}_reaction`, entries, seen);
      collectLines(option.nextDialogue, `${optionPrefix}_next`, entries, seen);
    });
  });
}

function collectChapter(chapter, entries, seen) {
  const prefix = `ch${chapter.id}`;
  collectLines(chapter.introDialogue, `${prefix}_intro`, entries, seen);

  const choiceSteps = chapter.choiceSteps || (chapter.choice ? [chapter.choice] : []);
  collectChoiceSteps(choiceSteps, prefix, entries, seen);

  collectLines(chapter.resolution, `${prefix}_resolution`, entries, seen);

  if (chapter.finalDeduction?.steps) {
    chapter.finalDeduction.steps.forEach((step, stepIndex) => {
      collectLines(step.reaction, `${prefix}_final_s${stepIndex + 1}_reaction`, entries, seen);
    });
  }
}

function collectEpilogue(epilogue, entries, seen) {
  collectLines(epilogue?.dialogue, 'epilogue', entries, seen);
}

function main() {
  const scenario = loadScenario();
  const entries = [];
  const seen = new Set();

  collectLines(scenario.prologue?.dialogue, 'prologue', entries, seen);
  (scenario.chapters || []).forEach((chapter) => collectChapter(chapter, entries, seen));
  collectEpilogue(scenario.epilogue, entries, seen);

  const missing = entries.filter((entry) => entry.file.startsWith('assets/audio/voice/'));
  const existing = entries.length - missing.length;

  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(entries, null, 2)}\n`, 'utf8');

  console.log('==================================================');
  console.log('GHOST PROTOCOL - 全セリフ抽出完了');
  console.log('==================================================');
  console.log(`総セリフ数: ${entries.length}`);
  console.log(`既存音声: ${existing}`);
  console.log(`新規生成対象: ${missing.length}`);
  console.log(`出力: ${path.relative(REPO_ROOT, OUTPUT_PATH)}`);
}

main();
