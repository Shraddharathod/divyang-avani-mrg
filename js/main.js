/* ==========================================================================
   MAIN APPLICATION SCRIPT: AVANI & DIVYANG WEDDING (V3 - SINGLE URL)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. LANGUAGE SWITCHER (SINGLE-URL IN-PLACE TOGGLE)
  const savedLang = localStorage.getItem('wedding_lang') || 'en';
  window.setLanguage(savedLang);

  // 2. DAY / NIGHT THEME TOGGLE
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('wedding_theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    updateThemeIcon(true);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('wedding_theme', isDark ? 'dark' : 'light');
      updateThemeIcon(isDark);
    });
  }

  function updateThemeIcon(isDark) {
    if (!themeToggle) return;
    themeToggle.innerHTML = isDark
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  }

  // 3. BACKGROUND MUSIC CONTROLLER
  const audio = document.getElementById('wedding-audio');
  const audioToggle = document.getElementById('audio-toggle');

  if (audio && audioToggle) {
    audioToggle.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().then(() => {
          audioToggle.classList.remove('paused');
        }).catch(e => console.error(e));
      } else {
        audio.pause();
        audioToggle.classList.add('paused');
      }
    });

    const userUnlockAudio = () => {
      if (audio.paused && !audioToggle.dataset.userPaused) {
        audio.play().then(() => {
          audioToggle.classList.remove('paused');
        }).catch(() => {});
      }
      window.removeEventListener('click', userUnlockAudio);
      window.removeEventListener('touchstart', userUnlockAudio);
    };
    window.addEventListener('click', userUnlockAudio, { once: true });
    window.addEventListener('touchstart', userUnlockAudio, { once: true });
  }

  // 4. ITINERARY CAROUSEL CONTROLS
  const track = document.getElementById('itinerary-track');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  if (track && prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -320, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: 320, behavior: 'smooth' });
    });
  }

  // 5. GROOM SIDE VS BRIDE SIDE TOGGLE
  const sideBtns = document.querySelectorAll('.side-btn');
  const venueGroom = document.getElementById('venue-groom');
  const venueBride = document.getElementById('venue-bride');

  sideBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sideBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const side = btn.dataset.side;
      updateSideDisplay(side);
    });
  });

  function updateSideDisplay(side) {
    const isGroom = side === 'groom';
    const isGu = document.body.classList.contains('lang-mode-gu');

    // Update event card location pills for 16th Jan
    document.querySelectorAll('.event-card[data-day="16"]').forEach(card => {
      const locPill = card.querySelector('.event-location-pill');
      if (locPill) {
        if (isGu) {
          locPill.innerHTML = isGroom 
            ? '📍 સતાપર ગામ, જામજોધપુર (૩૬૦૫૩૧)' 
            : '📍 જૂનાગઢ, ગુજરાત (૩૬૨૦૦૧)';
        } else {
          locPill.innerHTML = isGroom 
            ? '📍 Satapar Village, Jamjodhpur (360531)' 
            : '📍 Junagadh, Gujarat (362001)';
        }
      }
    });

    if (venueGroom && venueBride) {
      if (isGroom) {
        venueGroom.style.borderColor = 'var(--gold-primary)';
        venueBride.style.borderColor = 'var(--card-border)';
      } else {
        venueBride.style.borderColor = 'var(--gold-primary)';
        venueGroom.style.borderColor = 'var(--card-border)';
      }
    }
  }

  // 6. GALLERY LIGHTBOX MODAL
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  if (lightbox && lightboxImg) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('.gallery-img');
        const isGu = document.body.classList.contains('lang-mode-gu');
        const activeOverlay = item.querySelector(isGu ? '.gallery-overlay.lang-gu' : '.gallery-overlay.lang-en');
        const title = activeOverlay?.querySelector('.gallery-caption-title')?.innerText || '';
        const sub = activeOverlay?.querySelector('.gallery-caption-sub')?.innerText || '';
        if (img) {
          lightboxImg.src = img.src;
          lightboxCaption.innerText = sub ? `${title} • ${sub}` : title;
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto';
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }
});

// Single URL Language Switcher Function
window.setLanguage = function(lang) {
  const btnEn = document.getElementById('btn-lang-en');
  const btnGu = document.getElementById('btn-lang-gu');

  if (lang === 'gu') {
    document.body.classList.add('lang-mode-gu');
    document.documentElement.lang = 'gu';
    if (btnEn) btnEn.classList.remove('active');
    if (btnGu) btnGu.classList.add('active');
    localStorage.setItem('wedding_lang', 'gu');
  } else {
    document.body.classList.remove('lang-mode-gu');
    document.documentElement.lang = 'en';
    if (btnEn) btnEn.classList.add('active');
    if (btnGu) btnGu.classList.remove('active');
    localStorage.setItem('wedding_lang', 'en');
  }

  // Update side filter active label and location pills
  const activeSideBtn = document.querySelector('.side-btn.active');
  const currentSide = activeSideBtn ? activeSideBtn.dataset.side : 'groom';
  const isGu = lang === 'gu';

  document.querySelectorAll('.event-card[data-day="16"]').forEach(card => {
    const locPill = card.querySelector('.event-location-pill');
    if (locPill) {
      if (isGu) {
        locPill.innerHTML = currentSide === 'groom' 
          ? '📍 સતાપર ગામ, જામજોધપુર (૩૬૦૫૩૧)' 
          : '📍 જૂનાગઢ, ગુજરાત (૩૬૨૦૦૧)';
      } else {
        locPill.innerHTML = currentSide === 'groom' 
          ? '📍 Satapar Village, Jamjodhpur (360531)' 
          : '📍 Junagadh, Gujarat (362001)';
      }
    }
  });

  // Re-render countdown digits if available
  if (typeof window.renderCountdown === 'function') {
    window.renderCountdown();
  }
};
