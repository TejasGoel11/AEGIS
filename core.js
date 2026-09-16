/* Small local 3D renderer. No CDN, fonts, or external services required. */
class AegisCore {
  constructor(canvas, { compact = false, architecture = false } = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.compact = compact;
    this.architecture = architecture;
    this.angle = -.65;
    this.tilt = .49;
    this.selected = 0;
    this.expand = architecture ? .35 : 0;
    this.targetExpand = this.expand;
    this.energy = 0;
    this.paused = false;
    this.visible = false;
    this.dirty = true;
    this.reduced = matchMedia('(prefers-reduced-motion: reduce)');
    this.width = 1; this.height = 1;
    this.phase = 0;
    this.hitFaces = [];
    if (!this.ctx) return;
    new ResizeObserver(() => {
      const rect = canvas.getBoundingClientRect();
      this.width = rect.width; this.height = rect.height;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.dirty = true;
    }).observe(canvas);
    new IntersectionObserver(([entry]) => { this.visible = entry.isIntersecting; this.dirty = true; }).observe(canvas);
    let dragging = false, lastX = 0, lastY = 0, distance = 0;
    canvas.addEventListener('pointerdown', event => {
      dragging = true; lastX = event.clientX; lastY = event.clientY; distance = 0;
      canvas.setPointerCapture(event.pointerId);
    });
    canvas.addEventListener('pointermove', event => {
      if (!dragging) return;
      const dx = event.clientX - lastX, dy = event.clientY - lastY;
      this.angle += dx * .007;
      this.tilt = Math.max(.2, Math.min(.8, this.tilt + dy * .003));
      distance += Math.abs(dx) + Math.abs(dy);
      lastX = event.clientX; lastY = event.clientY; this.dirty = true;
    });
    canvas.addEventListener('pointerup', event => {
      dragging = false;
      if (distance > 6 || architecture || compact) return;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left, y = event.clientY - rect.top;
      for (const face of [...this.hitFaces].reverse()) {
        if (this.contains(face.points, x, y)) {
          canvas.dispatchEvent(new CustomEvent('layerselect', { detail: face.layer }));
          break;
        }
      }
    });
    canvas.addEventListener('pointercancel', () => { dragging = false; });
    canvas.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
      event.preventDefault();
      if (event.key === 'ArrowLeft') this.angle -= .12;
      if (event.key === 'ArrowRight') this.angle += .12;
      if (event.key === 'ArrowUp') this.tilt = Math.max(.2, this.tilt - .05);
      if (event.key === 'ArrowDown') this.tilt = Math.min(.8, this.tilt + .05);
      this.dirty = true;
    });
    let lastTime = 0;
    const frame = time => {
      const delta = Math.min((time - lastTime) / 1000, .05); lastTime = time;
      const moving = !this.paused && !this.reduced.matches;
      if (this.visible && !document.hidden && (moving || this.dirty)) {
        if (moving) {
          this.phase += delta;
          if (!dragging && !architecture) this.angle += delta * .07;
          this.expand += (this.targetExpand - this.expand) * Math.min(1, delta * 7);
        } else this.expand = this.targetExpand;
        this.paint(); this.dirty = false;
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }
  setLayer(index) { this.selected = index; this.dirty = true; }
  setExpansion(value) { this.targetExpand = value; this.dirty = true; }
  setEnergy(value) { this.energy = value; this.dirty = true; }
  contains(points, x, y) {
    let inside = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const a = points[i], b = points[j];
      if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) inside = !inside;
    }
    return inside;
  }
  project(x, y, z) {
    const scale = Math.min(this.width / (this.compact ? 320 : 470), this.height / (this.architecture ? 550 : 470));
    const X = x * Math.cos(this.angle) - z * Math.sin(this.angle);
    const Z = x * Math.sin(this.angle) + z * Math.cos(this.angle);
    return [this.width / 2 + X * scale, this.height * .51 + (y * Math.cos(this.tilt) + Z * Math.sin(this.tilt)) * scale, Z * Math.cos(this.tilt) - y * Math.sin(this.tilt)];
  }
  paint() {
    const ctx = this.ctx, w = this.width, h = this.height;
    ctx.clearRect(0, 0, w, h);
    if (!w || !h) return;
    const aura = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * .48);
    aura.addColorStop(0, `rgba(233,132,79,${.06 + this.energy * .055})`);
    aura.addColorStop(.5, 'rgba(89,123,120,.035)'); aura.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = aura; ctx.fillRect(0, 0, w, h);
    const line = (points, color, width = 1) => {
      ctx.beginPath(); points.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]));
      ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
    };
    if (!this.compact) {
      for (let n = -5; n <= 5; n++) {
        line([this.project(n * 42, 145, -210), this.project(n * 42, 145, 210)], '#a8b9b011', .6);
        line([this.project(-210, 145, n * 42), this.project(210, 145, n * 42)], '#a8b9b011', .6);
      }
      const orbit = [];
      for (let n = 0; n <= 100; n++) { const t = n / 100 * Math.PI * 2; orbit.push(this.project(Math.cos(t) * 205, 136, Math.sin(t) * 205)); }
      line(orbit, '#d5a37c44', .8);
    }
    const faces = [];
    const box = (x, y, z, sx, sy, sz, material, layer = -1) => {
      const vertices = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]].map(p => this.project(x + p[0] * sx / 2, y + p[1] * sy / 2, z + p[2] * sz / 2));
      [[0,1,2,3],[4,5,6,7],[0,4,7,3],[1,5,6,2],[0,1,5,4],[3,2,6,7]].forEach((f, index) => {
        const points = f.map(n => vertices[n]);
        faces.push({ points, depth: points.reduce((sum,p) => sum + p[2],0) / 4, material, index, layer });
      });
    };
    box(0, 125, 0, 232, 9, 208, 'base');
    box(0, 118, 0, 208, 3, 186, 'edge');
    for (let layer = 3; layer >= 0; layer--) {
      const y = -85 + layer * 52 + (layer - 1.5) * this.expand * 35;
      const active = layer === this.selected;
      box(0, y, 0, 170, 28, 154, active ? 'active' : 'metal', layer);
      box(0, y - 16, 0, 174, 4, 158, 'cap', layer);
      box(0, y + 15, 0, 173, 2, 157, active ? 'glow' : 'copper', layer);
      box(0, y - 19, 0, 92, 3, 82, active ? 'chip' : 'dark', layer);
      for (let n = 0; n < 9; n++) {
        box(-63 + n * 15.5, y + 1, 78, 7, 2, 1, active ? 'glow' : 'vent', layer);
        box(86, y + 1, -57 + n * 14, 1, 2, 6, active ? 'copper' : 'vent', layer);
      }
      for (const x of [-75,75]) for (const z of [-67,67]) box(x, y - 19, z, 4, 2, 4, 'screw', layer);
    }
    const colors = {
      base:['#1a2022','#303a3c'], edge:['#795947','#ca9574'], metal:['#252d30','#5d6b6b'],
      active:['#413830','#7a6d5f'], cap:['#3e494a','#81908a'], dark:['#182021','#303c3a'],
      copper:['#895539','#d89262'], glow:['#e69758','#ffd3a0'], chip:['#b36d42','#f0b479'],
      vent:['#0c1112','#46514d'], screw:['#5b6865','#b2bcb2']
    };
    this.hitFaces = [];
    faces.sort((a,b) => a.depth - b.depth).forEach(face => {
      const [low,high] = colors[face.material];
      const top = face.index === 4;
      const gradient = ctx.createLinearGradient(face.points[0][0], face.points[0][1] - 12, face.points[2][0] + 30, face.points[2][1] + 20);
      gradient.addColorStop(0, top ? high : low); gradient.addColorStop(.5, high); gradient.addColorStop(1, low);
      ctx.beginPath(); face.points.forEach((p,i) => i ? ctx.lineTo(p[0],p[1]) : ctx.moveTo(p[0],p[1])); ctx.closePath();
      ctx.fillStyle = gradient;
      if (face.material === 'glow') { ctx.shadowColor = '#f6a567'; ctx.shadowBlur = 8 + this.energy * 9; }
      ctx.fill(); ctx.shadowBlur = 0;
      ctx.strokeStyle = top ? '#d7d8b82e' : '#b9bfb916'; ctx.lineWidth = .6; ctx.stroke();
      if (face.layer >= 0) this.hitFaces.push(face);
    });
    if (!this.compact) {
      for (let n = 0; n < 5; n++) {
        const t = this.phase * .3 + n * 1.256;
        const p = this.project(Math.cos(t) * 205, 136, Math.sin(t) * 205);
        ctx.beginPath(); ctx.arc(p[0],p[1],2,0,Math.PI*2); ctx.fillStyle='#edb386';ctx.shadowColor='#edb386';ctx.shadowBlur=10;ctx.fill();ctx.shadowBlur=0;
      }
    }
    if (this.architecture) {
      for (let layer = 0; layer < 4; layer++) {
        const y = -85 + layer * 52 + (layer - 1.5) * this.expand * 35;
        const p = this.project(-95, y, 0);
        line([[p[0]-35,p[1]],[p[0]-8,p[1]]], layer === this.selected ? '#f6b078' : '#66746b', .8);
        ctx.font='11px monospace'; ctx.fillStyle=layer === this.selected ? '#f6b078' : '#8b988f';ctx.textAlign='right';ctx.fillText(`0${layer+1}`,p[0]-42,p[1]+4);
      }
    }
  }
}
window.AegisCore = AegisCore;
