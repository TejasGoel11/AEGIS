(() => {
  const canvas = document.querySelector('#core');
  const core = new AegisCore(canvas);
  core.selected = 1;
  core.setEnergy(.8);
  let expanded = false;
  let activeLayer = 1;

  function pulse(layer = activeLayer) {
    activeLayer = Math.max(0, Math.min(3, layer));
    core.setLayer(activeLayer);
    core.setEnergy(1.45);
    document.body.dataset.layer = String(activeLayer);
    document.body.classList.remove('pulse');
    void document.body.offsetWidth;
    document.body.classList.add('pulse');
    window.setTimeout(() => core.setEnergy(.8), 520);
  }

  canvas.addEventListener('layerselect', event => pulse(event.detail));
  canvas.addEventListener('dblclick', () => {
    expanded = !expanded;
    core.setExpansion(expanded ? 1 : 0);
    pulse(activeLayer);
  });
  canvas.addEventListener('keydown', event => {
    if (event.key >= '1' && event.key <= '4') {
      event.preventDefault();
      pulse(Number(event.key) - 1);
    }
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      expanded = !expanded;
      core.setExpansion(expanded ? 1 : 0);
      pulse(activeLayer);
    }
  });

  const canUseCustomCursor = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  const cursor = document.createElement('div');
  cursor.className = 'aegis-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  document.body.append(cursor);

  const hideCursor = () => {
    document.documentElement.classList.remove('cursor-on');
    cursor.classList.remove('visible', 'pressed');
  };
  document.addEventListener('pointermove', event => {
    if (!canUseCustomCursor.matches || event.pointerType !== 'mouse') return hideCursor();
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
    cursor.classList.add('visible');
    document.documentElement.classList.add('cursor-on');
  }, { passive: true });
  canvas.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse') cursor.classList.add('drag', 'pressed');
  });
  canvas.addEventListener('pointerup', () => cursor.classList.remove('pressed'));
  canvas.addEventListener('pointerleave', () => cursor.classList.remove('drag'));
  document.documentElement.addEventListener('pointerleave', hideCursor);
  document.addEventListener('keydown', hideCursor);
  window.addEventListener('blur', hideCursor);
  canUseCustomCursor.addEventListener('change', hideCursor);
})();
