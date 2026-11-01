const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const portalHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const portalExtrasScript = fs.readFileSync(path.join(root, 'assets/js/portal-extras.js'), 'utf8');

function createPortal(storageData) {
  const eveLinks = Array.from({ length: 4 }, () => ({ hidden: true }));
  const boxLinks = Array.from({ length: 2 }, () => ({ hidden: true }));
  const windowListeners = {};
  const documentListeners = {};
  const warnings = [];
  const context = {
    window: {
      localStorage: {
        getItem(key) {
          const data = storageData[key];
          if (data instanceof Error) throw data;
          return data ?? null;
        },
      },
      addEventListener(name, listener) {
        windowListeners[name] = listener;
      },
    },
    document: {
      visibilityState: 'visible',
      querySelectorAll(selector) {
        if (selector === '[data-eve-clear-bonus]') return eveLinks;
        if (selector === '[data-box-clear-bonus]') return boxLinks;
        assert.fail(`Unexpected selector: ${selector}`);
      },
      addEventListener(name, listener) {
        documentListeners[name] = listener;
      },
    },
    console: {
      warn(...args) {
        warnings.push(args);
      },
    },
    JSON,
    Array,
  };

  vm.runInNewContext(portalExtrasScript, context);
  return { eveLinks, boxLinks, windowListeners, documentListeners, warnings, context };
}

test('EVE and BOX bonus links unlock after their respective clear requirements', () => {
  assert.equal((portalHtml.match(/data-eve-clear-bonus/g) || []).length, 4);
  assert.equal((portalHtml.match(/data-box-clear-bonus/g) || []).length, 2);
  assert.match(portalHtml, /⏱ 想定20〜30分/);
  assert.equal((portalHtml.match(/⏱ 想定45〜60分/g) || []).length, 2);
  assert.match(portalHtml, /assets\/js\/portal-extras\.js/);

  const uncleared = createPortal({});
  assert.ok(uncleared.eveLinks.every((link) => link.hidden));
  assert.ok(uncleared.boxLinks.every((link) => link.hidden));

  const eveCleared = createPortal({ cleared_endings: JSON.stringify(['BAD', 'TRUE']) });
  assert.ok(eveCleared.eveLinks.every((link) => !link.hidden));
  assert.ok(eveCleared.boxLinks.every((link) => link.hidden));

  const boxFirstClear = createPortal({
    box_worm_save_v1: JSON.stringify({ hasClearedLoop1: true, hasClearedTrueEnd: false }),
  });
  assert.ok(boxFirstClear.boxLinks.every((link) => !link.hidden));
  assert.ok(boxFirstClear.eveLinks.every((link) => link.hidden));

  const boxTrueEnd = createPortal({
    box_worm_save_v1: JSON.stringify({ hasClearedLoop1: false, hasClearedTrueEnd: true }),
  });
  assert.ok(boxTrueEnd.boxLinks.every((link) => !link.hidden));
});

test('bonus visibility refreshes when returning to the portal or changing tabs', () => {
  const portal = createPortal({});
  portal.context.window.localStorage.getItem = (key) =>
    key === 'cleared_endings' ? '["TRUE"]' : '{"hasClearedLoop1":true}';
  portal.windowListeners.pageshow();
  assert.ok(portal.eveLinks.every((link) => !link.hidden));
  assert.ok(portal.boxLinks.every((link) => !link.hidden));

  portal.context.document.visibilityState = 'hidden';
  portal.context.window.localStorage.getItem = () => null;
  portal.documentListeners.visibilitychange();
  assert.ok(portal.eveLinks.every((link) => !link.hidden));
  assert.ok(portal.boxLinks.every((link) => !link.hidden));

  portal.context.document.visibilityState = 'visible';
  portal.documentListeners.visibilitychange();
  assert.ok(portal.eveLinks.every((link) => link.hidden));
  assert.ok(portal.boxLinks.every((link) => link.hidden));

  portal.context.window.localStorage.getItem = (key) =>
    key === 'box_worm_save_v1' ? '{"hasClearedTrueEnd":true}' : null;
  portal.windowListeners.storage({ key: 'box_worm_save_v1' });
  assert.ok(portal.eveLinks.every((link) => link.hidden));
  assert.ok(portal.boxLinks.every((link) => !link.hidden));
});

test('invalid or unavailable clear data keeps bonuses hidden and reports a warning', () => {
  const malformed = createPortal({ cleared_endings: '{invalid' });
  assert.ok(malformed.eveLinks.every((link) => link.hidden));
  assert.equal(malformed.warnings.length, 1);

  const unavailable = createPortal({ box_worm_save_v1: new Error('Storage unavailable') });
  assert.ok(unavailable.boxLinks.every((link) => link.hidden));
  assert.equal(unavailable.warnings.length, 1);

  const invalidBoxData = createPortal({ box_worm_save_v1: 'null' });
  assert.ok(invalidBoxData.boxLinks.every((link) => link.hidden));
  assert.equal(invalidBoxData.warnings.length, 1);
});
