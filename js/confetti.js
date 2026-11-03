/* ===================================================
   LUXURY CONFETTI & ROSE PETAL CANNON
   =================================================== */

window.launchWeddingConfetti = function() {
  const canvas = document.createElement('canvas');
  canvas.id = 'wedding-confetti-canvas';
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

  const colors = [
    '#ffd700', '#fff2a1', '#d4af37', '#e11d48', '#fb7185',
    '#ff4d6d', '#f72585', '#b38728', '#ffffff'
  ];

  const particles = [];
  const particleCount = 120;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: width / 2 + (Math.random() * 200 - 100),
      y: height * 0.5 + (Math.random() * 100 - 50),
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() * -12) - 6,
      size: Math.random() * 8 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      opacity: 1,
      shape: Math.random() > 0.4 ? 'petal' : 'rect'
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
      p.vy += 0.28; // Gravity
      p.vx *= 0.985; // Air drag
      p.rotation += p.rotationSpeed;

      if (elapsed > 2500) {
        p.opacity -= 0.015;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;

      if (p.shape === 'petal') {
        // Rose petal curve
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 1.5, Math.PI / 4, 0, 2 * Math.PI);
        ctx.fill();
      } else {
        // Metallic foil square/confetti
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
      }

      ctx.restore();
    });

    if (elapsed < 4500) {
      animationFrame = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animationFrame);
      canvas.remove();
    }
  }

  animationFrame = requestAnimationFrame(render);
};
