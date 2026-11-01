(function () {
  'use strict';

  const CLEAR_STORAGE_KEY = 'cleared_endings';
  const BOX_STORAGE_KEY = 'box_worm_save_v1';
  const eveBonusLinks = document.querySelectorAll('[data-eve-clear-bonus]');
  const boxBonusLinks = document.querySelectorAll('[data-box-clear-bonus]');

  if (eveBonusLinks.length === 0 && boxBonusLinks.length === 0) return;

  function readStoredData(key, gameName) {
    try {
      const savedData = window.localStorage.getItem(key);
      return savedData === null ? undefined : JSON.parse(savedData);
    } catch (error) {
      console.warn(`[PortalExtras] Failed to read ${gameName} clear data:`, error);
      return undefined;
    }
  }

  function hasClearedEveTrueEnd() {
    const clearedEndings = readStoredData(CLEAR_STORAGE_KEY, 'PROJECT EVE');
    if (clearedEndings === undefined) return false;
    if (
      !Array.isArray(clearedEndings) ||
      clearedEndings.some((ending) => typeof ending !== 'string')
    ) {
      console.warn('[PortalExtras] Invalid PROJECT EVE ending data.');
      return false;
    }

    return clearedEndings.includes('TRUE');
  }

  function hasClearedBox() {
    const saveData = readStoredData(BOX_STORAGE_KEY, 'BOX WORM');
    if (saveData === undefined) return false;
    if (saveData === null || typeof saveData !== 'object' || Array.isArray(saveData)) {
      console.warn('[PortalExtras] Invalid BOX WORM save data.');
      return false;
    }

    return saveData.hasClearedLoop1 === true || saveData.hasClearedTrueEnd === true;
  }

  function setLinksVisibility(links, unlocked) {
    links.forEach((link) => {
      link.hidden = !unlocked;
    });
  }

  function updateBonusLinks() {
    setLinksVisibility(eveBonusLinks, hasClearedEveTrueEnd());
    setLinksVisibility(boxBonusLinks, hasClearedBox());
  }

  function handleStorageChange(event) {
    if (event.key === CLEAR_STORAGE_KEY || event.key === BOX_STORAGE_KEY || event.key === null) {
      updateBonusLinks();
    }
  }

  function handleVisibilityChange() {
    if (document.visibilityState === 'visible') updateBonusLinks();
  }

  updateBonusLinks();
  window.addEventListener('pageshow', updateBonusLinks);
  window.addEventListener('storage', handleStorageChange);
  document.addEventListener('visibilitychange', handleVisibilityChange);
})();
