const fs = require('fs');

const content = fs.readFileSync('box/js/app.js', 'utf8');

function stripStringsAndComments(src) {
  let result = '';
  let i = 0;
  const len = src.length;
  let inString = null;
  let inTemplate = false;
  let inComment = false;
  let inBlockComment = false;

  while (i < len) {
    const ch = src[i];
    const next = src[i + 1];

    if (inComment) {
      if (ch === '\n') { inComment = false; result += '\n'; }
      else { result += ' '; }
      i++;
      continue;
    }
    if (inBlockComment) {
      if (ch === '*' && next === '/') { inBlockComment = false; result += '  '; i += 2; }
      else { if (ch === '\n') result += '\n'; else result += ' '; i++; }
      continue;
    }
    if (inString) {
      if (ch === '\\') { result += '  '; i += 2; continue; }
      if (ch === inString) { inString = null; result += ' '; i++; continue; }
      if (ch === '\n') result += '\n'; else result += ' ';
      i++;
      continue;
    }
    if (inTemplate) {
      if (ch === '\\') { result += '  '; i += 2; continue; }
      if (ch === '$' && next === '{') {
        result += '${'; i += 2;
        continue;
      }
      if (ch === '`') { inTemplate = false; result += ' '; i++; continue; }
      if (ch === '\n') result += '\n'; else result += ' ';
      i++;
      continue;
    }

    if (ch === '/' && next === '/') { inComment = true; result += '  '; i += 2; continue; }
    if (ch === '/' && next === '*') { inBlockComment = true; result += '  '; i += 2; continue; }
    if (ch === '\'' || ch === '"') { inString = ch; result += ' '; i++; continue; }
    if (ch === '`') { inTemplate = true; result += ' '; i++; continue; }

    result += ch;
    i++;
  }
  return result;
}

const cleaned = stripStringsAndComments(content);
const lines = cleaned.split('\n');

const methodRegex = /^  ([a-zA-Z0-9_]+)\s*\([^)]*\)\s*\{/;
let currentMethod = null;
const methods = [];

lines.forEach((line, index) => {
  const lineNum = index + 1;
  const match = line.match(methodRegex);
  if (match) {
    if (currentMethod) {
      currentMethod.endLine = lineNum - 1;
      currentMethod.lines = lines.slice(currentMethod.startLine - 1, lineNum - 1);
      methods.push(currentMethod);
    }
    currentMethod = { name: match[1], startLine: lineNum };
  }
});
if (currentMethod) {
  currentMethod.endLine = lines.length;
  currentMethod.lines = lines.slice(currentMethod.startLine - 1);
  methods.push(currentMethod);
}

function calcSonarCognitiveComplexity(lines) {
  let complexity = 0;
  let nesting = 0;

  lines.forEach(line => {
    // 制御構文の検出 (if, for, while, do, catch, switch, ternary)
    const ifMatches = (line.match(/\bif\b/g) || []).length;
    const loopMatches = (line.match(/\b(for|while|do)\b/g) || []).length;
    const catchMatches = (line.match(/\bcatch\b/g) || []).length;
    const switchMatches = (line.match(/\bswitch\b/g) || []).length;
    const ternaryMatches = (line.match(/\?/g) || []).length;

    const structuralIncrements = ifMatches + loopMatches + catchMatches + switchMatches + ternaryMatches;
    if (structuralIncrements > 0) {
      complexity += structuralIncrements * (1 + nesting);
    }

    const elseIfMatches = (line.match(/\belse\s+if\b/g) || []).length;
    const elseOnlyMatches = (line.match(/\belse\b(?!\s*if)/g) || []).length;
    complexity += elseIfMatches + elseOnlyMatches;

    const logicalMatches = (line.match(/(&&|\|\|)/g) || []).length;
    complexity += logicalMatches;

    for (const ch of line) {
      if (ch === '{') nesting++;
      if (ch === '}') nesting = Math.max(0, nesting - 1);
    }
  });

  return complexity;
}

const targetNames = [
  'bindEvents', 'bindTitleEvents', 'bindGalleryEvents', 'bindGalleryTabNavEvents', 'scrollGalleryTabs', 'updateGalleryTabArrows', 'openGallery', 'updateGalleryTabs', 'bindHudEvents', 'bindEvidenceModalEvents',
  'bindExploreEvents', 'bindDebateEvents', 'bindDialogueEvents', 'bindIllustrationViewerEvents',
  'bindEndingEvents', 'bindKeyboardEvents', 'bindPointerEvents',
  'handleKeydown', 'handleEscapeKey', 'handleBackKey', 'handleAdvanceKey', 'handleAreaSwitchKey',
  'handleNumberKey', 'handleModalShortcutKey', 'onTouchMoveGuard',
  'updateAudioButtons', 'updateAudioToggleButton', 'showScreen',
  'handleTalkNpc', 'onNpcChoiceSelected', 'onNpcDialogueComplete',
  'updateEvidenceCounter', 'setDebateButtonVisible', 'getExploreProgressInfo',
  'showNextDialogue', 'handleDialogueQueueEmpty', 'hideDialogueIllustration', 'updateDialogueIllustration', 'renderDialogueItem',
  'renderDebateEvidenceList', 'getSubmittedCorrectEvidenceIds', 'handleEvidenceCardSelect', 'renderDebateEvidencePreview', 'createDebateEvidenceCard',
  'renderEvidenceModalItems', 'createEvidenceModalItem'
];

console.log('--- REFACTORED METHODS SONAR COGNITIVE COMPLEXITY ---');
methods.filter(m => targetNames.includes(m.name)).forEach(m => {
  const cc = calcSonarCognitiveComplexity(m.lines);
  const status = cc <= 15 ? 'PASS (<=15)' : 'FAIL (>15)';
  console.log(`${m.name.padEnd(32)} Line: ${String(m.startLine).padStart(4)}  CC: ${String(cc).padStart(2)}  ${status}`);
});
