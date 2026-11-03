/* ==========================================================================
   DEVICE TRACKER & VISITOR ANALYTICS
   Avani & Divyang Wedding Invitation
   - Accurately detects device name (iPhone, Android, Mac, Windows, etc.)
   - Counts visits per device
   - Sends real-time visit ping to the couple's private dashboard feed
   ========================================================================== */

(function () {
  'use strict';

  const VISITS_TOPIC = 'divyang_avani_mrg_visits';
  const VISITS_URL = `https://ntfy.sh/${VISITS_TOPIC}`;

  // Accurate device detection
  window.getDetailedDevice = function () {
    const ua = navigator.userAgent;
    let deviceName = 'Desktop PC';
    let deviceCategory = 'desktop';

    if (/iPhone/i.test(ua)) {
      deviceName = 'Apple iPhone';
      deviceCategory = 'mobile';
    } else if (/iPad/i.test(ua)) {
      deviceName = 'Apple iPad';
      deviceCategory = 'tablet';
    } else if (/Android/i.test(ua)) {
      if (/Mobile/i.test(ua)) {
        deviceName = 'Android Mobile';
        deviceCategory = 'mobile';
      } else {
        deviceName = 'Android Tablet';
        deviceCategory = 'tablet';
      }
    } else if (/Macintosh|Mac OS X/i.test(ua)) {
      deviceName = 'Apple Mac';
      deviceCategory = 'desktop';
    } else if (/Windows NT/i.test(ua)) {
      deviceName = 'Windows PC';
      deviceCategory = 'desktop';
    } else if (/Linux/i.test(ua)) {
      deviceName = 'Linux Device';
      deviceCategory = 'desktop';
    }

    // Browser detection
    let browser = 'Browser';
    if (/Edg\//i.test(ua)) browser = 'Edge';
    else if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) browser = 'Chrome';
    else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) browser = 'Safari';
    else if (/Firefox\//i.test(ua)) browser = 'Firefox';
    else if (/SamsungBrowser/i.test(ua)) browser = 'Samsung Internet';

    const fullDeviceString = `${deviceName} (${browser})`;
    return {
      deviceName: fullDeviceString,
      category: deviceCategory,
      screen: `${window.screen.width}x${window.screen.height}`,
      browser: browser,
      platform: navigator.platform || 'Unknown',
      timestamp: new Date().toISOString()
    };
  };

  function recordVisit() {
    const info = window.getDetailedDevice();

    // 1. Local device tracking
    let deviceId = localStorage.getItem('wedding_device_uuid');
    if (!deviceId) {
      deviceId = 'dev_' + Math.random().toString(36).substring(2, 10);
      localStorage.setItem('wedding_device_uuid', deviceId);
    }

    let visits = parseInt(localStorage.getItem('wedding_device_visits') || '0', 10) + 1;
    localStorage.setItem('wedding_device_visits', visits.toString());
    localStorage.setItem('wedding_last_seen', info.timestamp);

    // Save for blessings form
    window.CURRENT_DEVICE_NAME = info.deviceName;

    // 2. Transmit to remote feed for dashboard (non-blocking)
    const payload = JSON.stringify({
      event: 'visit',
      deviceId: deviceId,
      device: info.deviceName,
      category: info.category,
      screen: info.screen,
      visitsCount: visits,
      time: info.timestamp
    });

    fetch(VISITS_URL, {
      method: 'POST',
      body: payload,
      headers: {
        'Title': `Visit: ${info.deviceName} (#${visits})`,
        'Tags': info.category === 'mobile' ? 'iphone,mobile' : 'computer,desktop'
      }
    }).catch(() => {});
  }

  // Trigger on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', recordVisit);
  } else {
    recordVisit();
  }
})();
