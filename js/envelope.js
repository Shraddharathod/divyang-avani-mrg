/* ===================================================
   3D ENVELOPE OPENING & WAX SEAL INTERACTION
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const envelopeModal = document.getElementById('envelope-modal');
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const waxSeal = document.getElementById('wax-seal');
  const audio = document.getElementById('wedding-audio');
  const audioToggle = document.getElementById('audio-toggle');

  if (!envelopeModal || !envelopeWrapper) return;

  let isOpening = false;

  function openEnvelope() {
    if (isOpening) return;
    isOpening = true;

    // Trigger open animation
    envelopeWrapper.classList.add('open');

    // Trigger subtle sparkle sound or bg music
    if (audio) {
      audio.play().then(() => {
        if (audioToggle) audioToggle.classList.remove('paused');
      }).catch(err => {
        console.log('Audio autoplay prevented by browser policy:', err);
      });
    }

    // Launch initial micro gold sparkles
    if (typeof window.launchWeddingConfetti === 'function') {
      setTimeout(() => {
        window.launchWeddingConfetti();
      }, 700);
    }

    // After card slides up, hide envelope modal and show landing page
    setTimeout(() => {
      envelopeModal.classList.add('opened');
      document.body.style.overflow = 'auto';
    }, 1800);
  }

  // Bind click & tap events
  envelopeWrapper.addEventListener('click', openEnvelope);
  if (waxSeal) waxSeal.addEventListener('click', (e) => {
    e.stopPropagation();
    openEnvelope();
  });

  // Reopen Envelope function (accessible from anywhere)
  window.reopenEnvelope = function() {
    envelopeModal.classList.remove('opened');
    envelopeWrapper.classList.remove('open');
    isOpening = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
});
