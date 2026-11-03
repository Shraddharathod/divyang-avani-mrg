/* ==========================================================================
   BLESSINGS & WELL WISHES SUBMISSION MODULE (AVANI & DIVYANG WEDDING)
   - Name-wise & User-wise Blessings
   - Strictly NO money / payment
   - No blessings list on public landing page (private database on dashboard.html)
   - Transmits device name, timestamp, and message to couple's database
   ========================================================================== */

(function () {
  'use strict';

  const STORAGE_KEY = 'divyang_avani_blessings_v1';
  const NTFY_TOPIC = 'divyang_avani_mrg_blessings';
  const NTFY_URL = `https://ntfy.sh/${NTFY_TOPIC}`;

  // Retrieve current device name
  function getDevice() {
    if (window.CURRENT_DEVICE_NAME) return window.CURRENT_DEVICE_NAME;
    if (typeof window.getDetailedDevice === 'function') {
      return window.getDetailedDevice().deviceName;
    }
    const ua = navigator.userAgent;
    if (/iPhone/i.test(ua)) return 'Apple iPhone (Safari)';
    if (/Android/i.test(ua)) return 'Android Mobile (Chrome)';
    if (/Macintosh/i.test(ua)) return 'Apple Mac (Safari)';
    return 'Desktop PC (Browser)';
  }

  // Update input placeholders according to active language (No 'e.g.', clean titles)
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
      time: blessingObj.timestamp,
      dateDisplay: blessingObj.dateDisplay
    });

    fetch(NTFY_URL, {
      method: 'POST',
      body: payload,
      headers: {
        'Title': `Blessing from ${blessingObj.name} [${blessingObj.device}]`,
        'Priority': 'high',
        'Tags': 'wedding,heart,sparkles'
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
        const text = chip.getAttribute('data-text');
        if (text) {
          if (msgTextarea.value.trim() === '') {
            msgTextarea.value = text;
          } else {
            msgTextarea.value += ' ' + text;
          }
          msgTextarea.focus();
          chip.style.transform = 'scale(0.95)';
          setTimeout(() => chip.style.transform = '', 200);
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

      const name = nameInput ? nameInput.value.trim() : '';
      const city = cityInput ? cityInput.value.trim() : '';
      const message = msgInput ? msgInput.value.trim() : '';

      if (!name || !message) {
        alert(document.body.classList.contains('lang-mode-gu')
          ? 'કૃપા કરીને આપનું શુભ નામ અને આશીર્વાદ સંદેશ બંને લખો.'
          : 'Please enter both your name and your blessing message.');
        return;
      }

      const now = new Date();
      const dateDisplay = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      const deviceUsed = getDevice();

      const newBlessing = {
        id: 'bless-' + Date.now(),
        name: name,
        city: city,
        relation: 'Well-wisher',
        message: message,
        device: deviceUsed,
        timestamp: now.toISOString(),
        dateDisplay: dateDisplay
      };

      // 1. Save to local storage for couple's dashboard
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const list = stored ? JSON.parse(stored) : [];
        list.unshift(newBlessing);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch (err) {}

      // 2. Transmit to remote database feed (receives on dashboard.html across all devices)
      sendToRemoteDatabase(newBlessing);

      // 3. Launch Rose Petals & Gold Confetti!
      if (typeof window.launchWeddingConfetti === 'function') {
        window.launchWeddingConfetti();
      }

      // 4. Show celebratory thank-you banner
      if (successBox) {
        successBox.style.display = 'block';
        successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => {
          successBox.style.display = 'none';
        }, 10000);
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
