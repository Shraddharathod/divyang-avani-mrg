/* ===================================================
   DECENT & SMOOTH CHAMPAGNE & PEARL SHIMMER
   - Minimalist, smooth, luxury micro-shimmer
   - No cheap flower petals or oversized shapes
   - Soft pearlescent gold, blush & champagne dust
   =================================================== */

window.launchWeddingConfetti = function() {
  const canvas = document.createElement('canvas');
  canvas.id = 'wedding-shimmer-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '999999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Elegant luxury pastel shimmer tones (Champagne, Pearl, Soft Rose Gold, Ivory)
  const colors = [
    '#e8cca4', '#f5ebd7', '#d9b48c', '#e2beb4', '#ffffff', '#faecd6', '#c9a87c'
  ];

  const particles = [];
  const particleCount = 75;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: width / 2 + (Math.random() * 260 - 130),
      y: height * 0.45 + (Math.random() * 80 - 40),
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() * -7) - 3,
      size: Math.random() * 3.5 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 1,
      fadeRate: Math.random() * 0.008 + 0.006
    });
  }

  let animationFrame;
  const startTime = Date.now();

  function render() {
    ctx.clearRect(0, 0, width, height);
    const elapsed = Date.now() - startTime;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.16; // Gentle gravity
      p.vx *= 0.985;

      if (elapsed > 1800) {
        p.opacity -= p.fadeRate;
      }

      if (p.opacity > 0) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });

    if (elapsed < 3800 && particles.some(p => p.opacity > 0)) {
      animationFrame = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animationFrame);
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }
  }

  render();
};
