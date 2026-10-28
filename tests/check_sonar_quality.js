// tests/check_sonar_quality.js - 全作品横断 SonarQube / SonarLint 品質基準チェッカー
// 検査項目:
//   - S3776: 関数の認知複雑度 (Cognitive Complexity <= 15)
//   - S7773: グローバル parseInt の使用禁止 (Number.parseInt を強制)
//   - S9423: CSS における !important の使用禁止
//   - S1874: 非推奨 CSS (word-break: break-word) の使用禁止

const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');

const jsFiles = [
  'assets/js/portal.js',
  'eve/js/app.js',
  'eve/js/audio.js',
  'eve/js/character.js',
  'eve/js/state.js',
  'box/js/app.js',
  'box/js/audio.js',
  'box/js/character.js',
  'box/js/state.js',
  'ghost/js/app.js',
  'ghost/js/audio.js',
  'ghost/js/character.js',
  'ghost/js/state.js',
];

const cssFiles = [
  'eve/css/style.css',
  'box/css/style.css',
  'ghost/css/style.css',
];

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
      if (ch === '\n') {
        inComment = false;
        result += '\n';
      } else {
        result += ' ';
      }
      i++;
      continue;
    }
    if (inBlockComment) {
      if (ch === '*' && next === '/') {
        inBlockComment = false;
        result += '  ';
        i += 2;
      } else {
        result += ch === '\n' ? '\n' : ' ';
        i++;
      }
      continue;
    }
    if (inString) {
      if (ch === '\\') {
        result += '  ';
        i += 2;
        continue;
      }
      if (ch === inString) {
        inString = null;
        result += ' ';
        i++;
        continue;
      }
      result += ch === '\n' ? '\n' : ' ';
      i++;
      continue;
    }
    if (inTemplate) {
      if (ch === '\\') {
        result += '  ';
        i += 2;
        continue;
      }
      if (ch === '`') {
        inTemplate = false;
        result += ' ';
        i++;
        continue;
      }
      result += ch === '\n' ? '\n' : ' ';
      i++;
      continue;
    }

    if (ch === '/' && next === '/') {
      inComment = true;
      result += '  ';
      i += 2;
      continue;
    }
    if (ch === '/' && next === '*') {
      inBlockComment = true;
      result += '  ';
      i += 2;
      continue;
    }
    if (ch === "'" || ch === '"') {
      inString = ch;
      result += ' ';
      i++;
      continue;
    }
    if (ch === '`') {
      inTemplate = true;
      result += ' ';
      i++;
      continue;
    }

    result += ch;
    i++;
  }
  return result;
}

function stripCssComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, (match) => match.replace(/[^\n]/g, ' '));
}

function calcSonarCognitiveComplexity(methodLines) {
  let complexity = 0;
  let nesting = 0;

  for (const line of methodLines) {
    const ifMatches = (line.match(/\bif\b/g) || []).length;
    const loopMatches = (line.match(/\b(for|while|do)\b/g) || []).length;
    const catchMatches = (line.match(/\bcatch\b/g) || []).length;
    const switchMatches = (line.match(/\bswitch\b/g) || []).length;
    const lineNoOptChain = line.replace(/\?\./g, '  ').replace(/\?\?/g, '  ');
    const ternaryMatches = (lineNoOptChain.match(/\?/g) || []).length;

    const structuralIncrements =
      ifMatches + loopMatches + catchMatches + switchMatches + ternaryMatches;
    if (structuralIncrements > 0) {
      const effectiveNesting = Math.max(0, nesting - 1);
      complexity += structuralIncrements * (1 + effectiveNesting);
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
  }

  return complexity;
}

let hasFailure = false;

console.log('=== 1. JavaScript S3776 (Cognitive Complexity <= 15) & S7773 (Number.parseInt) ===');
for (const relPath of jsFiles) {
  const fullPath = path.join(repoRoot, relPath);
  if (!fs.existsSync(fullPath)) continue;

  const content = fs.readFileSync(fullPath, 'utf8');
  const cleaned = stripStringsAndComments(content);
  const lines = cleaned.split('\n');

  // Check S7773: bare parseInt(
  lines.forEach((line, idx) => {
    if (/(?<![.\w])parseInt\s*\(/.test(line)) {
      console.error(`  ❌ [S7773] ${relPath}:${idx + 1} グローバル parseInt が使用されています（Number.parseInt を使用してください）`);
      hasFailure = true;
    }
  });

  // Extract class methods and top-level functions
  const methodRegex = /^(?:  ([a-zA-Z0-9_]+)\s*\([^)]*\)\s*\{|function\s+([a-zA-Z0-9_]+)\s*\([^)]*\)\s*\{)/;
  let currentMethod = null;
  const methods = [];

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const match = line.match(methodRegex);
    const fnName = match ? match[1] || match[2] : null;
    if (fnName && !['if', 'for', 'while', 'switch', 'catch'].includes(fnName)) {
      if (currentMethod) {
        currentMethod.endLine = lineNum - 1;
        currentMethod.lines = lines.slice(currentMethod.startLine - 1, lineNum - 1);
        methods.push(currentMethod);
      }
      currentMethod = { name: fnName, startLine: lineNum };
    } else if (/^\}/.test(line) && currentMethod) {
      currentMethod.endLine = lineNum - 1;
      currentMethod.lines = lines.slice(currentMethod.startLine - 1, lineNum - 1);
      methods.push(currentMethod);
      currentMethod = null;
    }
  });
  if (currentMethod) {
    currentMethod.endLine = lines.length;
    currentMethod.lines = lines.slice(currentMethod.startLine - 1);
    methods.push(currentMethod);
  }

  for (const m of methods) {
    const cc = calcSonarCognitiveComplexity(m.lines);
    if (cc > 15) {
      console.error(
        `  ❌ [S3776] ${relPath}:${m.startLine} ${m.name}() の認知複雑度が上限(15)を超えています (CC: ${cc})`,
      );
      hasFailure = true;
    }
  }
}

console.log('=== 2. CSS S9423 (!important 禁止) & S1874 (word-break: break-word 禁止) ===');
for (const relPath of cssFiles) {
  const fullPath = path.join(repoRoot, relPath);
  if (!fs.existsSync(fullPath)) continue;

  const content = fs.readFileSync(fullPath, 'utf8');
  const cleaned = stripCssComments(content);
  const lines = cleaned.split('\n');

  lines.forEach((line, idx) => {
    if (line.includes('!important')) {
      console.error(`  ❌ [S9423] ${relPath}:${idx + 1} !important が使用されています`);
      hasFailure = true;
    }
    if (/word-break\s*:\s*break-word/.test(line)) {
      console.error(
        `  ❌ [S1874] ${relPath}:${idx + 1} 非推奨の word-break: break-word が使用されています（overflow-wrap: break-word を使用してください）`,
      );
      hasFailure = true;
    }
  });
}

if (hasFailure) {
  console.error('\n❌ SonarQube 品質基準違反が検出されました。');
  process.exit(1);
} else {
  console.log('\n✅ 全作品（eve / box / ghost / portal）が SonarQube 品質基準（S3776 / S7773 / S9423 / S1874）をクリアしています。');
}
