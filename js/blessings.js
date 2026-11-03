/* ==========================================================================
   BLESSINGS & WELL WISHES SUBMISSION MODULE (AVANI & DIVYANG WEDDING)
   - Name-wise & User-wise Blessings
   - Strictly NO money / payment
   - Detects whether submitted in English or Gujarati
   - Attaches precise device name (iPhone, Android, Mac, Windows, Linux)
   - Transmits to private couple database on dashboard.html
   ========================================================================== */

(function () {
  'use strict';

  const STORAGE_KEY = 'divyang_avani_blessings_v1';
  const NTFY_TOPIC = 'divyang_avani_mrg_blessings';
  const NTFY_URL = `https://ntfy.sh/${NTFY_TOPIC}`;

  // Retrieve current device & OS
  function getDeviceDetails() {
    if (typeof window.getDetailedDevice === 'function') {
      return window.getDetailedDevice();
    }
    const ua = navigator.userAgent;
    let dev = 'Desktop PC';
    if (/iPhone/i.test(ua)) dev = 'Apple iPhone (Safari)';
    else if (/Android/i.test(ua)) dev = 'Android Mobile (Chrome)';
    else if (/Macintosh/i.test(ua)) dev = 'Apple Mac (Safari)';
    return {
      deviceName: dev,
      os: 'Desktop',
      browser: 'Browser',
      language: document.body.classList.contains('lang-mode-gu') ? 'ગુજરાતી' : 'English',
      langCode: document.body.classList.contains('lang-mode-gu') ? 'gu' : 'en'
    };
  }

  // Update input placeholders according to active language (Clean placeholders, no 'e.g.')
  function updatePlaceholders() {
    const isGu = document.body.classList.contains('lang-mode-gu');
    document.querySelectorAll('[data-placeholder-en]').forEach(el => {
      const ph = isGu ? el.getAttribute('data-placeholder-gu') : el.getAttribute('data-placeholder-en');
      if (ph) el.placeholder = ph;
    });
  }

  // Send blessing payload to couple's remote database feed
  function sendToRemoteDatabase(blessingObj) {
    const payload = JSON.stringify({
      event: 'blessing',
      id: blessingObj.id,
      name: blessingObj.name,
      city: blessingObj.city,
      message: blessingObj.message,
      device: blessingObj.device,
      os: blessingObj.os,
      browser: blessingObj.browser,
      language: blessingObj.language,
      langCode: blessingObj.langCode,
      time: blessingObj.timestamp,
      dateDisplay: blessingObj.dateDisplay
    });

    fetch(NTFY_URL, {
      method: 'POST',
      body: payload,
      headers: {
        'Title': `Blessing [${blessingObj.language}]: ${blessingObj.name} (${blessingObj.device})`,
        'Priority': 'high',
        'Tags': 'wedding,heart'
      }
    }).catch(err => console.log('Remote database note:', err));
  }

  // Quick Preset Chips click handler
  function initPresetChips() {
    const chips = document.querySelectorAll('.blessing-chip');
    const msgTextarea = document.getElementById('blessing-message');
    if (!chips || !msgTextarea) return;

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const isGu = document.body.classList.contains('lang-mode-gu') || localStorage.getItem('wedding_lang') === 'gu';
        const text = isGu 
          ? (chip.getAttribute('data-text-gu') || chip.getAttribute('data-text'))
          : (chip.getAttribute('data-text-en') || chip.getAttribute('data-text'));

        if (text) {
          if (msgTextarea.value.trim() === '') {
            msgTextarea.value = text;
          } else {
            msgTextarea.value += ' ' + text;
          }
          msgTextarea.focus();
        }
      });
    });
  }

  // Initialize Form Submit
  function initBlessingForm() {
    const form = document.getElementById('wedding-blessing-form');
    const successBox = document.getElementById('blessing-success-msg');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('blessing-name');
      const cityInput = document.getElementById('blessing-city');
      const msgInput = document.getElementById('blessing-message');

      // Preserve exact raw text entered by user without any translation or modification
      const rawName = nameInput ? nameInput.value.trim() : '';
      const rawCity = cityInput ? cityInput.value.trim() : '';
      const rawMessage = msgInput ? msgInput.value.trim() : '';

      const isGu = document.body.classList.contains('lang-mode-gu') || localStorage.getItem('wedding_lang') === 'gu';
      const activeLanguage = isGu ? 'ગુજરાતી' : 'English';
      const activeLangCode = isGu ? 'gu' : 'en';

      if (!rawName || !rawMessage) {
        alert(isGu
          ? 'કૃપા કરીને આપનું શુભ નામ અને આશીર્વાદ સંદેશ બંને લખો.'
          : 'Please enter both your name and your blessing message.');
        return;
      }

      const now = new Date();
      const dateDisplay = now.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      const devInfo = getDeviceDetails();

      // Structure object: language tracks landing page mode; name/city/message preserve exact input
      const newBlessing = {
        id: 'bless-' + Date.now(),
        name: rawName,
        city: rawCity,
        relation: 'Well-wisher',
        message: rawMessage,
        device: devInfo.deviceName || 'Mobile',
        os: devInfo.os || 'OS',
        browser: devInfo.browser || 'Browser',
        language: activeLanguage,
        langCode: activeLangCode,
        timestamp: now.toISOString(),
        dateDisplay: dateDisplay
      };

      // 1. Save to local storage
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const list = stored ? JSON.parse(stored) : [];
        list.unshift(newBlessing);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch (err) {}

      // 2. Transmit to remote database feed (captured on dashboard.html)
      sendToRemoteDatabase(newBlessing);

      // 3. Launch subtle modern champagne shimmer
      if (typeof window.launchWeddingConfetti === 'function') {
        window.launchWeddingConfetti();
      }

      // 4. Show celebratory thank-you banner
      if (successBox) {
        successBox.style.display = 'block';
        successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => {
          successBox.style.display = 'none';
        }, 12000);
      }

      // 5. Reset form
      form.reset();
    });
  }

  // Init on DOM Ready
  document.addEventListener('DOMContentLoaded', () => {
    initPresetChips();
    initBlessingForm();
    updatePlaceholders();
  });

  // Re-update placeholders on language change
  const origSetLanguage = window.setLanguage;
  if (typeof origSetLanguage === 'function') {
    window.setLanguage = function (lang) {
      origSetLanguage(lang);
      updatePlaceholders();
    };
  }

})();
