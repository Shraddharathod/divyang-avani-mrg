/* ===================================================
   INTERACTIVE SCRATCH CARD ENGINE & LIVE COUNTDOWN (V3)
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const heartCards = document.querySelectorAll('.heart-card');
  const celebrationBlock = document.getElementById('reveal-celebration');
  let revealedCount = 0;
  const totalHearts = heartCards.length;

  heartCards.forEach((card) => {
    const canvas = card.querySelector('.heart-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = (canvas.width = card.offsetWidth || 140);
    const height = (canvas.height = card.offsetHeight || 140);

    function drawFoil() {
      ctx.save();
      drawHeartPath(ctx, width, height);
      ctx.clip();

      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#E5C158');
      grad.addColorStop(0.25, '#FDF0A6');
      grad.addColorStop(0.5, '#C6922C');
      grad.addColorStop(0.75, '#FFE885');
      grad.addColorStop(1, '#A67018');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Glitter particles
      for (let i = 0; i < 40; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#fff' : '#fdf0a6';
        ctx.beginPath();
        ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      const isGu = document.body.classList.contains('lang-mode-gu');
      ctx.fillStyle = '#452b04';
      ctx.font = isGu ? 'bold 13px "Noto Serif Gujarati", sans-serif' : 'bold 12px "Montserrat", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(isGu ? 'સ્ક્રેચ' : 'SCRATCH', width / 2, height / 2 + 5);

      ctx.restore();
    }

    drawFoil();

    let isScratching = false;
    let scratchedPixels = 0;

    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    function scratch(pos) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 18, 0, Math.PI * 2);
      ctx.fill();
      scratchedPixels += 1;

      if (scratchedPixels > 25 && !card.classList.contains('revealed')) {
        revealCard(card);
      }
    }

    function revealCard(c) {
      if (c.classList.contains('revealed')) return;
      c.classList.add('revealed');
      revealedCount++;

      if (typeof window.launchWeddingConfetti === 'function' && revealedCount === 1) {
        window.launchWeddingConfetti();
      }

      if (revealedCount === totalHearts) {
        onAllHeartsRevealed();
      }
    }

    canvas.addEventListener('mousedown', (e) => { isScratching = true; scratch(getPos(e)); });
    canvas.addEventListener('mousemove', (e) => { if (isScratching) scratch(getPos(e)); });
    window.addEventListener('mouseup', () => { isScratching = false; });

    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      isScratching = true;
      scratch(getPos(e));
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (isScratching) scratch(getPos(e));
    }, { passive: false });

    window.addEventListener('touchend', () => { isScratching = false; });

    card.addEventListener('click', () => {
      revealCard(card);
    });
  });

  function drawHeartPath(ctx, w, h) {
    ctx.beginPath();
    const topCurveHeight = h * 0.3;
    ctx.moveTo(w / 2, h * 0.25);
    ctx.bezierCurveTo(w / 2, 0, 0, 0, 0, topCurveHeight);
    ctx.bezierCurveTo(0, (h + topCurveHeight) / 2, w / 2, (h + topCurveHeight) / 2, w / 2, h * 0.95);
    ctx.bezierCurveTo(w / 2, (h + topCurveHeight) / 2, w, (h + topCurveHeight) / 2, w, topCurveHeight);
    ctx.bezierCurveTo(w, 0, w / 2, 0, w / 2, h * 0.25);
    ctx.closePath();
  }

  function onAllHeartsRevealed() {
    if (celebrationBlock) {
      celebrationBlock.classList.add('active');
    }
    if (typeof window.launchWeddingConfetti === 'function') {
      window.launchWeddingConfetti();
      setTimeout(window.launchWeddingConfetti, 600);
    }
    startCountdown();
  }

  function toGujaratiNum(n) {
    const gujDigits = ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'];
    return String(n).padStart(2, '0').split('').map(d => gujDigits[parseInt(d, 10)] || d).join('');
  }

  // Live Countdown Timer to 17th January 2027 09:00 AM IST
  let days = 0, hours = 0, minutes = 0, seconds = 0;
  const weddingDate = new Date('2027-01-17T09:00:00+05:30').getTime();

  window.renderCountdown = function() {
    const isGu = document.body.classList.contains('lang-mode-gu');
    const daysEl = document.getElementById('count-days');
    const hoursEl = document.getElementById('count-hours');
    const minsEl = document.getElementById('count-mins');
    const secsEl = document.getElementById('count-secs');

    const labelDays = document.getElementById('label-days');
    const labelHours = document.getElementById('label-hours');
    const labelMins = document.getElementById('label-mins');
    const labelSecs = document.getElementById('label-secs');

    if (labelDays) labelDays.innerText = isGu ? 'દિવસો' : 'Days';
    if (labelHours) labelHours.innerText = isGu ? 'કલાક' : 'Hours';
    if (labelMins) labelMins.innerText = isGu ? 'મિનિટ' : 'Minutes';
    if (labelSecs) labelSecs.innerText = isGu ? 'સેકન્ડ' : 'Seconds';

    if (isGu) {
      if (daysEl) daysEl.innerText = toGujaratiNum(days);
      if (hoursEl) hoursEl.innerText = toGujaratiNum(hours);
      if (minsEl) minsEl.innerText = toGujaratiNum(minutes);
      if (secsEl) secsEl.innerText = toGujaratiNum(seconds);
    } else {
      if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
      if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
      if (minsEl) minsEl.innerText = String(minutes).padStart(2, '0');
      if (secsEl) secsEl.innerText = String(seconds).padStart(2, '0');
    }
  };

  function updateTimer() {
    const now = new Date().getTime();
    const difference = weddingDate - now;

    if (difference <= 0) return;

    days = Math.floor(difference / (1000 * 60 * 60 * 24));
    hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    seconds = Math.floor((difference % (1000 * 60)) / 1000);

    window.renderCountdown();
  }

  function startCountdown() {
    updateTimer();
    setInterval(updateTimer, 1000);
  }

  startCountdown();
});

// Google Calendar Helper
window.addToGoogleCalendar = function() {
  const isGu = document.body.classList.contains('lang-mode-gu');
  const title = encodeURIComponent(isGu 
    ? 'અવની અને દિવ્યાંગનો શુભ લગ્ન ઉત્સવ' 
    : 'Avani Makwana & Divyang Rathod Wedding');
  const details = encodeURIComponent(isGu
    ? 'અવની મકવાણા અને દિવ્યાંગ રાઠોડનો પવિત્ર વિવાહ ઉત્સવ'
    : 'Auspicious wedding ceremony of Avani Makwana & Divyang Rathod');
  const location = encodeURIComponent('Satapar & Junagadh, Gujarat');
  const start = '20270116T023000Z';
  const end = '20270117T123000Z';
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${start}/${end}`;
  window.open(url, '_blank');
};
