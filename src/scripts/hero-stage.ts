const stage = document.querySelector<HTMLElement>('[data-stage]');

if (stage) {
  const article = stage.querySelector<HTMLElement>('[data-stage-article]')!;
  const svg = stage.querySelector<SVGSVGElement>('[data-traces]')!;
  const state = stage.querySelector<HTMLElement>('[data-stage-state]')!;
  const bytesLabel = stage.querySelector<HTMLElement>('[data-stage-bytes]')!;
  const recover = stage.querySelector<HTMLButtonElement>('[data-stage-recover]')!;
  const linkedHTML = article.innerHTML;
  const plainClone = article.cloneNode(true) as HTMLElement;
  plainClone.querySelectorAll('.trace-anchor').forEach((anchor) => {
    anchor.replaceWith(document.createTextNode(anchor.textContent ?? ''));
  });
  const plainHTML = plainClone.innerHTML;

  const byteCount = (value: string) => new TextEncoder().encode(value).length;
  const originalBytes = byteCount(plainHTML);
  const format = (value: number) => value.toLocaleString('en-US');
  bytesLabel.textContent = `${format(originalBytes)} bytes in · ${format(originalBytes)} preserved`;
  let recovered = false;
  let frame = 0;

  function drawTraces() {
    if (window.matchMedia('(max-width: 900px)').matches) {
      svg.replaceChildren();
      return;
    }

    const stageRect = stage.getBoundingClientRect();
    const articleRect = article.getBoundingClientRect();
    if (!stageRect.width) return;
    svg.setAttribute('viewBox', `0 0 ${stageRect.width} ${stageRect.height}`);
    svg.replaceChildren();

    stage.querySelectorAll<HTMLElement>('.trace-anchor').forEach((anchor, index) => {
      const row = stage.querySelector<HTMLElement>(`[data-dest-row="${index}"]`);
      if (!row) return;
      const a = anchor.getBoundingClientRect();
      const r = row.getBoundingClientRect();
      const sx = articleRect.right - stageRect.left - 2;
      const sy = a.top - stageRect.top + a.height / 2;
      const ex = r.left - stageRect.left + 3;
      const ey = r.top - stageRect.top + r.height / 2;
      const bend = Math.max(12, Math.min(34, (ex - sx) * 0.5));

      const pin = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      pin.setAttribute('cx', String(sx));
      pin.setAttribute('cy', String(sy));
      pin.setAttribute('r', '2.3');
      pin.setAttribute('fill', '#2563EB');
      pin.setAttribute('opacity', '0');
      pin.classList.add('trace-pin');
      pin.dataset.index = String(index);
      svg.appendChild(pin);

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M ${sx + 3} ${sy} C ${sx + bend} ${sy}, ${ex - bend} ${ey}, ${ex} ${ey}`);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'currentColor');
      path.setAttribute('stroke-width', '1.2');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-dasharray', '1.5 4.5');
      path.setAttribute('opacity', '0');
      path.classList.add('trace-path');
      path.dataset.index = String(index);
      svg.appendChild(path);

      window.requestAnimationFrame(() => {
        window.setTimeout(() => {
          pin.setAttribute('opacity', '0.85');
          path.setAttribute('opacity', '0.55');
        }, 160 + index * 90);
      });
    });
  }

  function setHot(index: number) {
    stage.querySelectorAll<SVGElement>('.trace-path, .trace-pin').forEach((path) => {
      path.classList.toggle('is-hot', path.dataset.index === String(index));
    });
    stage.querySelectorAll<HTMLElement>('.dest').forEach((row) => {
      row.classList.toggle('is-hot', row.dataset.destRow === String(index));
    });
  }

  function bind() {
    stage.querySelectorAll<HTMLElement>('.trace-anchor').forEach((anchor) => {
      const index = Number(anchor.dataset.dest);
      const enter = () => setHot(index);
      const leave = () => setHot(-1);
      anchor.addEventListener('pointerenter', enter);
      anchor.addEventListener('pointerleave', leave);
      anchor.addEventListener('focus', enter);
      anchor.addEventListener('blur', leave);
    });

    stage.querySelectorAll<HTMLElement>('[data-dest-row]').forEach((row) => {
      const index = Number(row.dataset.destRow);
      const enter = () => setHot(index);
      const leave = () => setHot(-1);
      row.addEventListener('pointerenter', enter);
      row.addEventListener('pointerleave', leave);
      row.addEventListener('focus', enter);
      row.addEventListener('blur', leave);
    });
  }

  function resetTraces() {
    window.cancelAnimationFrame(frame);
    frame = window.requestAnimationFrame(drawTraces);
  }

  recover.addEventListener('click', () => {
    recovered = !recovered;
    if (recovered) {
      article.innerHTML = plainHTML;
      stage.classList.add('is-recovered');
      state.textContent = 'original intact';
      bytesLabel.textContent = `${format(originalBytes)} bytes in · ${format(originalBytes)} out · identical`;
      bytesLabel.classList.add('stage__proof');
      recover.textContent = 'Insert links again';
      svg.replaceChildren();
    } else {
      article.innerHTML = linkedHTML;
      stage.classList.remove('is-recovered');
      state.textContent = '3 verified';
      bytesLabel.textContent = `${format(originalBytes)} bytes in · ${format(originalBytes)} preserved`;
      bytesLabel.classList.remove('stage__proof');
      recover.textContent = 'Remove markup';
      bind();
      resetTraces();
    }
  });

  if (document.fonts) {
    document.fonts.ready.then(() => resetTraces());
  }
  window.addEventListener('load', resetTraces, { once: true });
  new ResizeObserver(() => {
    if (!recovered) resetTraces();
  }).observe(stage);

  bind();
  resetTraces();
}
