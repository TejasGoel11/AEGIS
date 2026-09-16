// Interactive core rendering lives in core.js.
const tasks={report:{title:'Inspection to approval',model:'Qwen2.5-VL → Qwen3',request:'Read the scanned inspection report, find critical issues, and draft an approval note using our maintenance SOP.',steps:['Read scanned report with local OCR + vision','Retrieve maintenance SOP from the local knowledge base','Draft findings and cross-check source references','Prepare the approval note for human review'],result:'Approval note prepared · 3 findings identified · SOP references attached.',file:'approval-note.txt',content:'DEMONSTRATION — APPROVAL NOTE\nSubject: Inspection follow-up for pump P-204\nSource: Synthetic inspection report and illustrative maintenance SOP.\n\nFindings:\n1. Seal leakage observed.\n2. Elevated bearing vibration reported.\n3. Guard fastener missing.\n\nRecommendation: Request maintenance planning review, validate inspection measurements, and obtain authorized approval before any work.\n\nThis sample is a frontend demonstration, not an engineering assessment.'},code:{title:'Code, run, verify',model:'Qwen2.5-Coder',request:'Write a Python utility that converts temperature readings from Celsius to Fahrenheit, then verify it with known reference values.',steps:['Plan a standalone Python conversion utility','Write the function inside the local sandbox','Verify reference cases: 0°C → 32°F and 100°C → 212°F','Package code with assertions and test summary'],result:'Sample utility prepared · 2 reference cases illustrated · Ready for review.',file:'temperature_converter.py',content:'"""Example utility from the AEGIS concept demo."""\ndef celsius_to_fahrenheit(celsius):\n    return celsius * 9 / 5 + 32\n\nif __name__ == "__main__":\n    assert celsius_to_fahrenheit(0) == 32\n    assert celsius_to_fahrenheit(100) == 212\n    print("2 tests passed")\n'},vision:{title:'Understand a drawing',model:'Qwen2.5-VL',request:'Review a scanned piping diagram, identify the equipment tags, and flag any details that need engineering verification.',steps:['Load the sample drawing with local vision','Extract equipment labels and visible connections','Cross-reference the local equipment register','Summarize observations and uncertain readings'],result:'Drawing review prepared · 3 sample tags · 1 item flagged for human verification.',file:'drawing-review.txt',content:'DEMONSTRATION — DRAWING REVIEW\nSynthetic example, not an analysis of a real drawing.\n\nSample tags: P-204, V-102, E-301.\nEquipment: Pump, vessel, heat exchanger.\nVerification required: Confirm valve label against the original high-resolution drawing.\nDo not use this example for operational decisions.'}};let current='report',running=false,url;const pipeline=document.querySelector('#pipeline'),run=document.querySelector('#run'),output=document.querySelector('#output');function select(key){current=key;const t=tasks[key];document.querySelectorAll('[role=tab]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.task===key)));document.querySelector('#task-title').textContent=t.title;document.querySelector('#model').textContent=t.model;document.querySelector('#request').textContent=t.request;pipeline.innerHTML=t.steps.map((s,i)=>`<div class="step"><b>${i+1}</b><span>${s}</span></div>`).join('');output.hidden=true;document.querySelector('#run-status').textContent='Ready to run on local infrastructure';run.innerHTML='Run workflow <span>↗</span>'}document.querySelectorAll('[role=tab]').forEach((b,i,arr)=>{b.onclick=()=>{if(!running)select(b.dataset.task)};b.onkeydown=e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();if(!running){let next=arr[(i+(e.key==='ArrowRight'?1:arr.length-1))%arr.length];next.focus();select(next.dataset.task)}}};});run.onclick=async()=>{if(running)return;running=true;run.disabled=true;document.querySelectorAll('[role=tab]').forEach(b=>b.disabled=true);output.hidden=true;const steps=[...pipeline.children];steps.forEach(s=>s.className='step');document.querySelector('#run-status').textContent='Simulating local agent execution…';for(let i=0;i<steps.length;i++){steps[i].classList.add('active');await new Promise(r=>setTimeout(r,650));steps[i].className='step done';steps[i].querySelector('b').textContent='✓'}if(url)URL.revokeObjectURL(url);const t=tasks[current];url=URL.createObjectURL(new Blob([t.content],{type:'text/plain'}));output.innerHTML=`<strong>${t.result}</strong><br>Concept demo: no AI model or sandbox is connected.<br><a href="${url}" download="${t.file}">↓ Download sample ${t.file}</a>`;output.hidden=false;document.querySelector('#run-status').textContent='Demo complete · Sample deliverable ready';run.textContent='Run again ↻';run.disabled=false;document.querySelectorAll('[role=tab]').forEach(b=>b.disabled=false);running=false};select(current);


// Fine-pointer enhancement; touch and accessibility preferences keep native cursors.
(() => {
  const enabled = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) and (forced-colors: none)');
  const pointer = document.createElement('div');
  pointer.className = 'aegis-cursor';
  pointer.setAttribute('aria-hidden', 'true');
  document.body.append(pointer);
  const root = document.documentElement;
  const hide = () => {
    root.classList.remove('custom-cursor-on');
    pointer.classList.remove('visible', 'pressed');
  };
  document.addEventListener('pointermove', event => {
    if (!enabled.matches || event.pointerType !== 'mouse') return hide();
    const target = event.target;
    if (!(target instanceof Element) || target.closest('input, textarea, select, [contenteditable="true"]')) return hide();
    pointer.style.left = `${event.clientX}px`;
    pointer.style.top = `${event.clientY}px`;
    pointer.classList.toggle('interactive', !!target.closest('a, button:not(:disabled), [role="tab"]:not(:disabled)'));
    pointer.classList.toggle('draggable', !!target.closest('#core'));
    pointer.classList.add('visible');
    root.classList.add('custom-cursor-on');
  }, { passive: true });
  document.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse') pointer.classList.add('pressed');
  });
  document.addEventListener('pointerup', () => pointer.classList.remove('pressed'));
  document.addEventListener('pointercancel', hide);
  document.documentElement.addEventListener('pointerleave', hide);
  document.addEventListener('keydown', hide);
  window.addEventListener('blur', hide);
  document.addEventListener('visibilitychange', () => { if (document.hidden) hide(); });
  enabled.addEventListener('change', hide);
})();
