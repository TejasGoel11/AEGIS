(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const hero = new AegisCore(document.querySelector('#core'));
  const heroVisual = document.querySelector('.hero-visual');
  heroVisual.insertAdjacentHTML('beforeend', `<div class="model-switch" role="group" aria-label="Highlight a specialist model"><button data-model="0" aria-pressed="true"><span>01</span> Reasoning</button><button data-model="1" aria-pressed="false"><span>02</span> Code</button><button data-model="2" aria-pressed="false"><span>03</span> Vision</button></div>`);
  const modelNames = ['REASONING ENGINE', 'CODING SPECIALIST', 'VISION ENGINE'];
  const modelDetails = ['Qwen3 / local inference', 'Qwen2.5-Coder / local inference', 'Qwen2.5-VL / local inference'];
  function highlightModel(index) {
    hero.setLayer(index);
    document.querySelectorAll('[data-model]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.model) === index)));
    document.querySelector('.label-a div').innerHTML = `${modelNames[index]}<small>${modelDetails[index]}</small>`;
  }
  document.querySelectorAll('[data-model]').forEach(button => button.onclick = () => highlightModel(Number(button.dataset.model)));
  document.querySelector('#core').addEventListener('layerselect', event => highlightModel(Math.min(2, event.detail)));
  highlightModel(0);

  document.querySelector('.features').outerHTML = `<section class="architecture" id="architecture" aria-label="Four layers of the local architecture">
    <div class="architecture-scene"><div class="section-label">THE SOVEREIGN STACK <span id="layer-count">01 / 04</span></div><canvas id="architecture-core" aria-label="Exploded 3D architecture showing the selected system layer"></canvas><div class="architecture-caption"><span id="layer-tag">01 / WORKBENCH</span><strong id="layer-caption">One place to get work done.</strong></div><div class="layer-selector" role="group" aria-label="Explore architecture layers"><button data-layer="0" aria-pressed="true" aria-label="Workbench layer">01</button><button data-layer="1" aria-pressed="false" aria-label="Agent tools layer">02</button><button data-layer="2" aria-pressed="false" aria-label="Model routing layer">03</button><button data-layer="3" aria-pressed="false" aria-label="Infrastructure layer">04</button></div><p class="scene-hint">SCROLL TO REVEAL THE SYSTEM ↓</p></div>
    <div class="architecture-story">
      <article class="architecture-step active" data-layer-step="0"><span class="section-label">LAYER 01 / THE WORKBENCH</span><h3>One request.<br>A finished deliverable.</h3><p>Approval notes, spreadsheets, presentations, and working code. Start with a task and leave with something your team can use.</p><div class="mini-tags"><span>DOCUMENTS</span><span>CODE</span><span>CALCULATIONS</span></div></article>
      <article class="architecture-step" data-layer-step="1"><span class="section-label">LAYER 02 / AGENT TOOLS</span><h3>It plans.<br>Then it gets to work.</h3><p>A local agent breaks down the task, searches your SOPs, reads files, executes in a sandbox, and checks the result before handing it back.</p><div class="mini-tags"><span>PLAN</span><b>→</b><span>ACT</span><b>→</b><span>VERIFY</span></div></article>
      <article class="architecture-step" data-layer-step="2"><span class="section-label">LAYER 03 / MODEL ROUTING</span><h3>The right mind.<br>For the right problem.</h3><p>Route code to a coding specialist, scanned documents to a vision model, and complex synthesis to a reasoning model. Swap models as the ecosystem evolves.</p><div class="mini-tags"><span>REASONING</span><span>CODE</span><span>VISION</span></div></article>
      <article class="architecture-step" data-layer-step="3"><span class="section-label">LAYER 04 / YOUR INFRASTRUCTURE</span><h3>Local from the<br>ground up.</h3><p>Your GPU server, your knowledge base, your access controls. Start with a smaller model on a single workstation and scale with your hardware.</p><div class="mini-tags"><span>ON-PREMISE</span><span>AIR-GAP READY</span></div></article>
    </div></section>`;
  const architectureCore = new AegisCore(document.querySelector('#architecture-core'), { architecture: true });
  const architectureSteps = [...document.querySelectorAll('[data-layer-step]')];
  const layerNames = ['WORKBENCH', 'AGENT TOOLS', 'MODEL ROUTING', 'YOUR INFRASTRUCTURE'];
  const layerCaptions = ['One place to get work done.', 'Local tools. Multi-step action.', 'Many minds. One intelligent router.', 'Every operation stays inside.'];
  let activeLayer = -1;
  function revealLayer(index) {
    if (activeLayer === index) return;
    activeLayer = index;
    architectureCore.setLayer(index);
    architectureCore.setExpansion(.25 + index * .25);
    document.querySelector('#layer-count').textContent = `0${index + 1} / 04`;
    document.querySelector('#layer-tag').textContent = `0${index + 1} / ${layerNames[index]}`;
    document.querySelector('#layer-caption').textContent = layerCaptions[index];
    architectureSteps.forEach((step, i) => step.classList.toggle('active', i === index));
    document.querySelectorAll('[data-layer]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.layer) === index)));
  }
  document.querySelectorAll('[data-layer]').forEach(button => button.onclick = () => {
    const index = Number(button.dataset.layer);
    revealLayer(index);
    if (innerWidth > 760) architectureSteps[index].scrollIntoView({ behavior: reduced.matches ? 'instant' : 'smooth', block: 'center' });
  });
  let scrollFrame = 0;
  function onScroll() {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      if (innerWidth <= 760) return;
      let closest = 0, distance = Infinity;
      architectureSteps.forEach((step, index) => {
        const rect = step.getBoundingClientRect();
        const d = Math.abs(rect.top + rect.height / 2 - innerHeight / 2);
        if (d < distance) { distance = d; closest = index; }
      });
      revealLayer(closest);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  revealLayer(0); onScroll();

  pipeline.insertAdjacentHTML('beforebegin', `<div class="execution-stage" id="execution-stage"><div class="transfer-card input-card"><span class="file-symbol">▤</span><strong id="input-label">inspection.pdf</strong><small>LOCAL INPUT</small></div><div class="transfer-line line-in"></div><div class="workflow-core-wrap"><canvas id="workflow-core" aria-label="3D core showing the model selected for this simulated workflow"></canvas><span id="core-stage-label">AWAITING TASK</span></div><div class="transfer-line line-out"></div><div class="transfer-card output-card"><span class="file-symbol">▤</span><strong id="output-label">approval note</strong><small>OUTPUT</small></div></div>`);
  const workflowCore = new AegisCore(document.querySelector('#workflow-core'), { compact: true });
  // Keep the action above the detailed preview, including on small screens.
  output.before(document.querySelector('.wb-controls'));
  const panel = document.querySelector('.wb-main');
  panel.id = 'workflow-panel';
  panel.setAttribute('role', 'tabpanel');
  document.querySelectorAll('[data-task]').forEach(button => {
    button.id = `task-${button.dataset.task}`;
    button.setAttribute('aria-controls', panel.id);
  });
  const cores = [hero, architectureCore, workflowCore];
  let motionPaused = reduced.matches;
  const motionButton = document.querySelector('#rotate');
  function syncMotion() {
    cores.forEach(core => { core.paused = motionPaused; core.dirty = true; });
    document.body.classList.toggle('motion-paused', motionPaused);
    motionButton.textContent = motionPaused ? 'Resume motion ▷' : 'Pause motion Ⅱ';
    motionButton.setAttribute('aria-pressed', String(motionPaused));
  }
  motionButton.onclick = () => { motionPaused = !motionPaused; syncMotion(); };
  reduced.addEventListener('change', () => { motionPaused = reduced.matches; syncMotion(); });
  syncMotion();

  const securityMap = `<svg class="security-map" viewBox="0 0 500 250" role="img" aria-labelledby="security-map-title"><title id="security-map-title">Models, knowledge, and sandbox connect to the local workbench inside a closed security perimeter</title><rect class="boundary" x="12" y="16" width="476" height="214" rx="24"/><text x="32" y="42" class="map-meta">ON-PREMISE / ISOLATED NETWORK</text><g class="map-paths"><path d="M250 117 L95 117 L95 182"/><path d="M250 117 L250 182"/><path d="M250 117 L405 117 L405 182"/></g><rect class="map-hub" x="181" y="65" width="138" height="52" rx="8"/><text x="250" y="88" class="centered">AEGIS</text><text x="250" y="104" class="map-meta centered">LOCAL ORCHESTRATOR</text><g class="map-nodes"><rect x="33" y="164" width="124" height="44" rx="6"/><rect x="188" y="164" width="124" height="44" rx="6"/><rect x="343" y="164" width="124" height="44" rx="6"/><text x="95" y="190">Models</text><text x="250" y="190">Knowledge</text><text x="405" y="190">Sandbox</text></g><circle class="packet packet-one" r="4"/><circle class="packet packet-two" r="4"/><circle class="packet packet-three" r="4"/></svg>`;
  document.querySelector('.network-title').insertAdjacentHTML('afterend', securityMap);
  document.querySelector('.network-title > span:first-child').textContent = '⌁ YOUR SECURITY PERIMETER';
  document.querySelector('#sovereignty h2').innerHTML = 'A closed loop.<br><span>An open audit trail.</span>';
  document.querySelector('#sovereignty ul').insertAdjacentHTML('afterend', '<button class="trace-button" id="trace">Replay local trace <span>↗</span></button>');
  const trace = document.querySelector('#trace');
  let tracing = false;
  const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
  async function runTrace() {
    if (tracing) return;
    tracing = true; trace.disabled = true;
    const network = document.querySelector('.network');
    const log = document.querySelector('#network-log');
    const routes = ['inference.local', 'knowledge.local', 'sandbox.local'];
    network.classList.add('tracing');
    log.innerHTML = '';
    for (let i = 0; i < routes.length; i++) {
      await sleep(650);
      log.insertAdjacentHTML('beforeend', `<p><time>00:00:0${i + 1}</time> ${routes[i]} <span>LOOPBACK</span></p>`);
    }
    await sleep(700);
    network.classList.remove('tracing');
    trace.disabled = false; tracing = false;
  }
  trace.onclick = runTrace;

  const previews = {
    report: `<div class="document-preview"><div class="document-masthead"><span>AEGIS / MAINTENANCE</span><span class="document-stamp">DRAFT FOR REVIEW</span></div><h3>Maintenance approval note</h3><p class="document-subtitle">Pump P-204 · Inspection follow-up</p><div class="document-rule"></div><p><strong>Purpose</strong><br>Request review and approval of corrective maintenance following the sample inspection.</p><table><caption>Inspection findings · synthetic example</caption><thead><tr><th>Finding</th><th>Recommended next step</th></tr></thead><tbody><tr><td>01 · Seal leakage</td><td>Verify extent and plan repair</td></tr><tr><td>02 · Bearing vibration</td><td>Confirm measured values</td></tr><tr><td>03 · Missing guard fastener</td><td>Refer for maintenance review</td></tr></tbody></table><div class="document-reference"><span>REFERENCE</span> Maintenance SOP · illustrative source</div><p class="document-footnote">Human authorization required before operational use.</p></div>`,
    code: `<div class="code-preview"><div class="editor-toolbar"><span><i></i><i></i><i></i></span><span>temperature_converter.py</span><span>PYTHON</span></div><pre><code><span class="code-comment"># Standalone conversion utility</span>\n<span class="code-purple">def</span> <span class="code-gold">celsius_to_fahrenheit</span>(celsius):\n    <span class="code-purple">return</span> celsius * <span class="code-orange">9</span> / <span class="code-orange">5</span> + <span class="code-orange">32</span>\n\n<span class="code-comment"># Reference checks</span>\n<span class="code-purple">assert</span> celsius_to_fahrenheit(<span class="code-orange">0</span>) == <span class="code-orange">32</span>\n<span class="code-purple">assert</span> celsius_to_fahrenheit(<span class="code-orange">100</span>) == <span class="code-orange">212</span></code></pre><div class="test-console"><span>ILLUSTRATIVE TEST OUTPUT</span><p>✓ freezing_point <b>0°C → 32°F</b></p><p>✓ boiling_point <b>100°C → 212°F</b></p><div>2 reference cases · Sample Python is not executed by this page</div></div></div>`,
    vision: `<div class="drawing-preview"><div class="drawing-toolbar"><span>P&amp;ID / PROCESS LINE 02</span><span>SYNTHETIC EXAMPLE</span></div><svg viewBox="0 0 640 265" role="img" aria-label="Illustrative piping diagram with a pump P-204, vessel V-102, exchanger E-301, and a valve label requiring verification"><defs><pattern id="drawing-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#7995ac18" stroke-width="1"/></pattern></defs><rect width="640" height="265" fill="url(#drawing-grid)"/><g fill="none" stroke="#9bbcc7" stroke-width="2"><path d="M20 145H100M160 145H275M365 145H470M530 145H620M320 110V60H500V115"/><circle cx="130" cy="145" r="30"/><path d="M112 160V130L151 145Z"/><rect x="275" y="110" width="90" height="90" rx="26"/><circle cx="500" cy="145" r="30"/><path d="M480 145h40M500 125v40M205 133l24 24v-24l-24 24z"/></g><g fill="#d6e7e9" font-family="monospace" font-size="14" text-anchor="middle"><text x="130" y="209">P-204</text><text x="320" y="232">V-102</text><text x="500" y="209">E-301</text></g><g fill="none" stroke="#ee906a" stroke-dasharray="4 4"><rect x="88" y="102" width="84" height="84" rx="9"/><rect x="265" y="100" width="110" height="110" rx="9"/><rect x="458" y="102" width="84" height="84" rx="9"/></g><path d="M216 130V73" stroke="#ee906a"/><rect x="135" y="43" width="164" height="30" rx="4" fill="#493225"/><text x="217" y="63" text-anchor="middle" fill="#ffc693" font-family="monospace" font-size="12">! Verify valve label</text></svg><div class="drawing-findings"><span>✓ 3 equipment tags</span><span>! 1 detail needs review</span></div></div>`
  };
  const io = {
    report: ['inspection.pdf', 'approval note', 2],
    code: ['coding request', 'verified utility', 1],
    vision: ['piping-scan.pdf', 'drawing review', 2]
  };
  const originalSelect = select;
  select = function(key) {
    originalSelect(key);
    panel.setAttribute('aria-labelledby', `task-${key}`);
    const [inputName, outputName, modelIndex] = io[key];
    document.querySelector('#input-label').textContent = inputName;
    document.querySelector('#output-label').textContent = outputName;
    workflowCore.setLayer(modelIndex); workflowCore.setEnergy(0);
    highlightModel(modelIndex);
    document.querySelector('#execution-stage').dataset.phase = 'idle';
    document.querySelector('#core-stage-label').textContent = 'AWAITING TASK';
    output.hidden = false;
    output.innerHTML = `<div class="output-heading"><span>DELIVERABLE PREVIEW</span><span>EXAMPLE / NOT YET RUN</span></div>${previews[key]}<p class="output-disclaimer">Synthetic example. Run the simulation to follow the steps and download the sample.</p>`;
    document.querySelectorAll('[data-task]').forEach(button => button.setAttribute('tabindex', button.dataset.task === key ? '0' : '-1'));
  };
  const stage = document.querySelector('#execution-stage');
  run.onclick = async () => {
    if (running) return;
    running = true; run.disabled = true;
    document.querySelectorAll('[data-task]').forEach(button => button.disabled = true);
    const steps = [...pipeline.children];
    steps.forEach((step,index) => { step.className = 'step'; step.querySelector('b').textContent = index+1; });
    output.hidden = true;
    document.querySelector('#run-status').textContent = 'Simulating a local agent workflow…';
    run.textContent = 'Working…';
    hero.setEnergy(1); workflowCore.setEnergy(1);
    runTrace();
    const labels = ['READING LOCAL INPUT', 'ROUTING TO SPECIALIST', 'REASONING + VERIFYING', 'PREPARING DELIVERABLE'];
    for (let i = 0; i < steps.length; i++) {
      stage.dataset.phase = ['input','route','process','output'][i];
      document.querySelector('#core-stage-label').textContent = labels[i];
      const modelIndex = current === 'report' && i > 1 ? 0 : io[current][2];
      workflowCore.setLayer(modelIndex); highlightModel(modelIndex);
      workflowCore.setExpansion(i === 1 ? .45 : .1);
      steps[i].classList.add('active');
      await sleep(1000);
      steps[i].className = 'step done'; steps[i].querySelector('b').textContent = '✓';
    }
    if (url) URL.revokeObjectURL(url);
    const task = tasks[current];
    url = URL.createObjectURL(new Blob([task.content], { type: 'text/plain' }));
    output.innerHTML = `<div class="output-heading"><span>DELIVERABLE READY</span><span>✓ SIMULATION COMPLETE</span></div>${previews[current]}<div class="deliverable-footer"><p>${task.result}</p><a class="button primary" href="${url}" download="${task.file}">Download sample <span>↓</span></a></div><p class="output-disclaimer">Concept demo. No AI model, Python sandbox, or real inspection data is connected.</p>`;
    output.hidden = false; stage.dataset.phase = 'done';
    document.querySelector('#core-stage-label').textContent = 'TASK COMPLETE';
    document.querySelector('#run-status').textContent = 'Demo complete · Sample deliverable ready';
    hero.setEnergy(0); workflowCore.setEnergy(0); workflowCore.setExpansion(0);
    run.textContent = 'Run again ↻'; run.disabled = false;
    document.querySelectorAll('[data-task]').forEach(button => button.disabled = false);
    running = false;
  };
  select(current);

  // Motion is deliberately limited to entrances, the core, and active operations.
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), { threshold: .12 });
  document.querySelectorAll('.statement, .section-heading, .sovereignty > div:first-child, .closing').forEach(element => {
    element.classList.add('reveal'); observer.observe(element);
  });
  document.querySelectorAll('.transfer-card').forEach(card => {
    card.addEventListener('pointermove', event => {
      if (!finePointer.matches || reduced.matches || motionPaused) return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.style.transform = `perspective(500px) rotateX(${-y*5}deg) rotateY(${x*5}deg)`;
    });
    card.addEventListener('pointerleave', () => card.style.transform = '');
  });
})();
