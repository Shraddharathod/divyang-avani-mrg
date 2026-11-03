/* ==========================================================================
   ADVANCED VISITOR & DEVICE ANALYTICS TRACKER
   Avani & Divyang Wedding Invitation
   - Tracks iOS (iPhone, iPad), Android, macOS, Windows, Linux
   - Detects all browsers (Safari, Chrome, Firefox, Edge, Samsung Internet)
   - Tracks active page language (English vs Gujarati)
   - Counts opens per device and syncs to couple's private dashboard
   ========================================================================== */

(function () {
  'use strict';

  const VISITS_TOPIC = 'divyang_avani_mrg_visits';
  const VISITS_URL = `https://ntfy.sh/${VISITS_TOPIC}`;

  // Comprehensive OS & Device Detection
  window.getDetailedDevice = function () {
    const ua = navigator.userAgent || navigator.vendor || window.opera || '';
    let os = 'Unknown OS';
    let deviceName = 'Device';
    let deviceCategory = 'desktop';

    // 1. Detect Operating System & Hardware
    if (/iPhone/i.test(ua)) {
      deviceName = 'Apple iPhone';
      os = 'iOS';
      deviceCategory = 'mobile';
      // Try to detect iOS version
      const match = ua.match(/OS (\d+_\d+)/);
      if (match) os = 'iOS ' + match[1].replace('_', '.');
    } else if (/iPad/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
      deviceName = 'Apple iPad';
      os = 'iPadOS';
      deviceCategory = 'tablet';
    } else if (/Android/i.test(ua)) {
      deviceCategory = /Mobile/i.test(ua) ? 'mobile' : 'tablet';
      os = 'Android';
      // Detect common Android brand markers
      if (/Samsung|SM-|GT-/i.test(ua)) deviceName = 'Samsung Galaxy';
      else if (/Pixel/i.test(ua)) deviceName = 'Google Pixel';
      else if (/OnePlus/i.test(ua)) deviceName = 'OnePlus Phone';
      else if (/Xiaomi|Redmi|POCO/i.test(ua)) deviceName = 'Xiaomi / Redmi';
      else if (/Oppo|CPH/i.test(ua)) deviceName = 'Oppo Phone';
      else if (/Vivo/i.test(ua)) deviceName = 'Vivo Phone';
      else deviceName = deviceCategory === 'tablet' ? 'Android Tablet' : 'Android Mobile';
    } else if (/Macintosh|Mac OS X/i.test(ua)) {
      deviceName = 'Apple Mac (MacBook/iMac)';
      os = 'macOS';
      deviceCategory = 'laptop';
    } else if (/Windows NT 10.0/i.test(ua)) {
      deviceName = 'Windows PC';
      os = 'Windows 10/11';
      deviceCategory = 'desktop';
    } else if (/Windows NT/i.test(ua)) {
      deviceName = 'Windows PC';
      os = 'Windows';
      deviceCategory = 'desktop';
    } else if (/CrOS/i.test(ua)) {
      deviceName = 'Chromebook';
      os = 'ChromeOS';
      deviceCategory = 'laptop';
    } else if (/Linux/i.test(ua)) {
      deviceName = 'Linux Desktop';
      os = 'Linux';
      deviceCategory = 'desktop';
    }

    // 2. Detect Browser
    let browser = 'Browser';
    if (/SamsungBrowser/i.test(ua)) browser = 'Samsung Internet';
    else if (/Edg\//i.test(ua)) browser = 'Microsoft Edge';
    else if (/OPR\/|Opera/i.test(ua)) browser = 'Opera';
    else if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) browser = 'Google Chrome';
    else if (/CriOS/i.test(ua)) browser = 'Chrome iOS';
    else if (/FxiOS/i.test(ua)) browser = 'Firefox iOS';
    else if (/Firefox\//i.test(ua)) browser = 'Mozilla Firefox';
    else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) browser = 'Apple Safari';

    // 3. Current active language on invitation
    const activeLang = document.body.classList.contains('lang-mode-gu') ? 'ગુજરાતી (GU)' : 'English (EN)';

    const fullDeviceString = `${deviceName} • ${browser}`;

    return {
      deviceName: fullDeviceString,
      baseDevice: deviceName,
      browser: browser,
      os: os,
      category: deviceCategory,
      screen: `${window.screen.width} × ${window.screen.height}`,
      language: activeLang,
      langCode: document.body.classList.contains('lang-mode-gu') ? 'gu' : 'en',
      platform: navigator.platform || 'Unknown',
      timestamp: new Date().toISOString()
    };
  };

  function recordVisit() {
    const info = window.getDetailedDevice();

    // Local device tracking
    let deviceId = localStorage.getItem('wedding_device_uuid');
    if (!deviceId) {
      deviceId = 'dev_' + Math.random().toString(36).substring(2, 10);
      localStorage.setItem('wedding_device_uuid', deviceId);
    }

    let visits = parseInt(localStorage.getItem('wedding_device_visits') || '0', 10) + 1;
    localStorage.setItem('wedding_device_visits', visits.toString());
    localStorage.setItem('wedding_last_seen', info.timestamp);

    // Save for blessings form to inherit
    window.CURRENT_DEVICE_NAME = info.deviceName;
    window.CURRENT_DEVICE_OS = info.os;
    window.CURRENT_DEVICE_BROWSER = info.browser;

    // Transmit visit log to cloud topic (Zero non-ASCII in headers to prevent mobile ByteString errors)
    fetch(VISITS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: payload,
      keepalive: true
    }).catch(() => {});

    // Secondary redundant channel
    fetch(`https://ntfy.sh/${VISITS_TOPIC}_backup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: payload,
      keepalive: true
    }).catch(() => {});
  }

  // Trigger on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', recordVisit);
  } else {
    recordVisit();
  }

})();
