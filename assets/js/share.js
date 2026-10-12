/**
 * VOICE VISUAL NOVELS - SNS Share & Clipboard Copy Utility
 * Provides Web Share API integration, X (Twitter) post intents, and cyber toast notifications.
 */

(function () {
  'use strict';

  // サイバートースト通知を表示
  function showCyberToast(message, type = 'info') {
    let toast = document.getElementById('cyberToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cyberToast';
      toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 99999;
        background: rgba(15, 23, 42, 0.95);
        color: #f8fafc;
        border: 1px solid #00f3ff;
        border-radius: 8px;
        padding: 12px 20px;
        font-family: 'Chakra Petch', 'Noto Sans JP', sans-serif;
        font-size: 0.9rem;
        letter-spacing: 0.05em;
        box-shadow: 0 0 25px rgba(0, 243, 255, 0.35), 0 10px 30px rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        gap: 10px;
        transform: translateY(100px);
        opacity: 0;
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      `;
      document.body.appendChild(toast);
    }

    const icon = type === 'success' ? '✔' : '⚡';
    toast.innerHTML = `<span style="color: #00f3ff; font-weight: bold;">${icon}</span> <span>${message}</span>`;
    
    // 表示アニメーション
    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    });

    // タイマーで非表示
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.style.transform = 'translateY(100px)';
      toast.style.opacity = '0';
    }, 2800);
  }

  // URLをクリップボードにコピー
  async function copyLink(urlToCopy, successMsg) {
    const url = urlToCopy || window.location.href;
    const msg = successMsg || 'リンクをクリップボードにコピーしました！';
    
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      showCyberToast(msg, 'success');
    } catch (err) {
      console.warn('Clipboard copy failed:', err);
      showCyberToast('URLコピーに失敗しました', 'info');
    }
  }

  // X (Twitter) でシェア
  function shareOnX(options) {
    const defaultUrl = window.location.href;
    const defaultText = document.title;
    const url = options.url || defaultUrl;
    const text = options.text || defaultText;
    const hashtags = options.hashtags || 'PROJECT_EVE,VoiceVisualNovel';
    
    const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent(hashtags)}`;
    window.open(intentUrl, '_blank', 'width=550,height=420,menubar=no,toolbar=no,scrollbars=yes');
  }

  // ネイティブシェアまたはフォールバック
  async function smartShare(options) {
    const url = options.url || window.location.href;
    const title = options.title || document.title;
    const text = options.text || '';

    if (navigator.share && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (e) {
        if (e.name !== 'AbortError') {
          console.warn('Native share failed:', e);
        } else {
          return;
        }
      }
    }
    // デスクトップまたは共有非対応ブラウザは Xシェア画面を開く
    shareOnX(options);
  }

  // グローバル公開
  window.CyberShare = {
    showToast: showCyberToast,
    copyLink: copyLink,
    shareOnX: shareOnX,
    smartShare: smartShare
  };

  // 自動イベントハンドラ登録
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-share-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const action = btn.getAttribute('data-share-action');
        const text = btn.getAttribute('data-share-text') || '';
        const url = btn.getAttribute('data-share-url') || window.location.href;
        const hashtags = btn.getAttribute('data-share-hashtags') || 'PROJECT_EVE,VoiceVisualNovel';

        if (action === 'x') {
          shareOnX({ text, url, hashtags });
        } else if (action === 'copy') {
          copyLink(url);
        } else if (action === 'smart') {
          smartShare({ text, url, hashtags });
        }
      });
    });
  });
})();
