(() => {
  const clock = document.querySelector('[data-clock]');
  if (clock) {
    const updateClock = () => {
      clock.textContent = new Intl.DateTimeFormat('ru-RU', {
        timeZone: 'Europe/Moscow',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(new Date());
    };
    updateClock();
    window.setInterval(updateClock, 1000);
  }

  const canvas = document.querySelector('.network-lines');
  const shell = document.querySelector('.database-shell');
  const core = document.querySelector('[data-node="core"]');
  const nodes = [...document.querySelectorAll('.network-node')];
  if (!canvas || !shell || !core || !nodes.length) return;

  const context = canvas.getContext('2d');
  let active = null;

  const point = (element, bounds) => {
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left - bounds.left + rect.width / 2,
      y: rect.top - bounds.top + rect.height / 2
    };
  };

  const line = (from, to, emphasized = false) => {
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.strokeStyle = emphasized ? '#0b0c0b' : 'rgba(11, 12, 11, .42)';
    context.lineWidth = emphasized ? 2 : 1;
    context.stroke();

    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    const arrowSize = emphasized ? 8 : 6;
    context.beginPath();
    context.moveTo(to.x, to.y);
    context.lineTo(to.x - arrowSize * Math.cos(angle - Math.PI / 6), to.y - arrowSize * Math.sin(angle - Math.PI / 6));
    context.lineTo(to.x - arrowSize * Math.cos(angle + Math.PI / 6), to.y - arrowSize * Math.sin(angle + Math.PI / 6));
    context.closePath();
    context.fillStyle = emphasized ? '#0b0c0b' : 'rgba(11, 12, 11, .42)';
    context.fill();
  };

  const draw = () => {
    const ratio = window.devicePixelRatio || 1;
    const bounds = shell.getBoundingClientRect();
    canvas.width = Math.round(bounds.width * ratio);
    canvas.height = Math.round(bounds.height * ratio);
    canvas.style.width = `${bounds.width}px`;
    canvas.style.height = `${bounds.height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, bounds.width, bounds.height);

    const origin = point(core, bounds);
    nodes.forEach((node) => line(origin, point(node, bounds), node === active));
    line(point(nodes[0], bounds), point(nodes[3], bounds), false);
    line(point(nodes[1], bounds), point(nodes[2], bounds), false);
    line(point(nodes[3], bounds), point(nodes[4], bounds), false);
  };

  nodes.forEach((node) => {
    node.addEventListener('mouseenter', () => { active = node; draw(); });
    node.addEventListener('mouseleave', () => { active = null; draw(); });
    node.addEventListener('focus', () => { active = node; draw(); });
    node.addEventListener('blur', () => { active = null; draw(); });
  });

  window.addEventListener('resize', draw, { passive: true });
  window.addEventListener('load', draw);
  draw();
})();
