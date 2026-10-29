import { autoLink, type AutoLinkResult } from '../lib/linker';
import { scenarios } from '../lib/samples';

const root = document.querySelector<HTMLElement>('[data-demo]');

if (root) {
  const article = root.querySelector<HTMLElement>('[data-article]')!;
  const source = root.querySelector<HTMLElement>('[data-source]')!;
  const corpus = root.querySelector<HTMLElement>('[data-corpus]')!;
  const corpusCount = root.querySelector<HTMLElement>('[data-corpus-count]')!;
  const audit = root.querySelector<HTMLElement>('[data-audit]')!;
  const empty = root.querySelector<HTMLElement>('[data-empty]')!;
  const live = root.querySelector<HTMLElement>('[data-live]')!;
  const runButton = root.querySelector<HTMLButtonElement>('[data-run]')!;
  const runLabel = root.querySelector<HTMLElement>('[data-run-label]')!;
  const recoverButton = root.querySelector<HTMLButtonElement>('[data-recover]')!;
  const bytesLabel = root.querySelector<HTMLElement>('[data-bytes]')!;
  const diag = root.querySelector<HTMLElement>('[data-diag]')!;
  const statLinks = root.querySelector<HTMLElement>('[data-stat="links"]')!;
  const statCandidates = root.querySelector<HTMLElement>('[data-stat="candidates"]')!;
  const statSkipped = root.querySelector<HTMLElement>('[data-stat="skipped"]')!;
  const statTime = root.querySelector<HTMLElement>('[data-stat="time"]')!;
  const maxOutput = root.querySelector<HTMLOutputElement>('[data-max]')!;
  const scenarioButtons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-scenario]'));
  const modeButtons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-mode]'));
  const viewButtons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-view]'));

  interface State {
    index: number;
    maxLinks: number;
    mode: 'insert' | 'suggest';
    view: 'rendered' | 'html';
    result: AutoLinkResult | null;
    original: string;
    originalBytes: number;
    recovered: boolean;
    busy: boolean;
  }

  const state: State = {
    index: 0,
    maxLinks: 4,
    mode: 'insert',
    view: 'rendered',
    result: null,
    original: '',
    originalBytes: 0,
    recovered: false,
    busy: false,
  };

  const bytes = (value: string) => new TextEncoder().encode(value).length;
  const formatBytes = (value: number) => `${value.toLocaleString('en-US')} bytes`;

  const escapeHtml = (value: string) =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  function highlightSource(content: string): string {
    let out = escapeHtml(content);
    out = out.replace(
      /(&lt;a\b[^]*?data-autolink="true"&gt;)/g,
      '<span class="tag-new">$1</span>',
    );
    out = out.replace(/(&lt;\/a&gt;)/g, '<span class="tag-new">$1</span>');
    out = out.replace(
      /(&lt;span data-autolink="suggest"&gt;)/g,
      '<span class="tag-new">$1</span>',
    );
    out = out.replace(/(&lt;\/span&gt;)/g, '<span class="tag-new">$1</span>');
    return out;
  }

  function renderCorpus() {
    const scenario = scenarios[state.index];
    corpus.innerHTML = '';
    corpusCount.textContent = `${scenario.pages.length}`;
    scenario.pages.forEach((page) => {
      const row = document.createElement('div');
      row.className = 'corpus__row';
      row.dataset.url = page.url;

      const title = document.createElement('span');
      title.className = 'corpus__title';
      title.textContent = page.title;

      const stateDot = document.createElement('span');
      stateDot.className = 'corpus__state';
      stateDot.setAttribute('aria-hidden', 'true');

      const url = document.createElement('span');
      url.className = 'corpus__url';
      url.textContent = page.url.replace('https://juhenza.com', '');

      const keys = document.createElement('span');
      keys.className = 'corpus__keys';
      (page.keywords ?? []).slice(0, 2).forEach((keyword) => {
        const key = document.createElement('span');
        key.textContent = keyword;
        keys.appendChild(key);
      });

      row.append(title, stateDot, url, keys);
      corpus.appendChild(row);
    });
  }

  function syncView() {
    const html = state.view === 'html';
    article.hidden = html;
    source.hidden = !html;
    viewButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.view === state.view));
    });
  }

  function renderSource() {
    const content = state.recovered ? state.original : state.result ? state.result.content : state.original;
    source.innerHTML = highlightSource(content);
  }

  function setStats(selected: number, candidates: number, skipped: number, elapsed: number | null) {
    statLinks.textContent = `${selected}`;
    statCandidates.textContent = `${candidates}`;
    statSkipped.textContent = `${skipped}`;
    statTime.textContent = elapsed === null ? '—' : `${elapsed.toFixed(1)} ms`;
  }

  function renderAudit(result: AutoLinkResult | null) {
    audit.innerHTML = '';
    if (!result || result.links.length === 0) {
      audit.hidden = true;
      empty.hidden = false;
      empty.textContent = result
        ? `No phrase cleared the ${'0.52'} relevance floor. The engine returned fewer links rather than filling a quota.`
        : 'No run yet. The engine will only return links that clear every rule.';
      empty.className = 'demo__empty';
      return;
    }

    audit.hidden = false;
    empty.hidden = true;

    result.links.forEach((link, index) => {
      const row = document.createElement('li');
      row.className = 'audit__row';
      row.style.animationDelay = `${index * 55}ms`;

      const number = document.createElement('span');
      number.className = 'audit__n';
      number.textContent = String(index + 1).padStart(2, '0');

      const anchor = document.createElement('span');
      anchor.className = 'audit__anchor';
      const anchorText = document.createElement('strong');
      anchorText.textContent = link.anchor;
      const reason = document.createElement('span');
      reason.className = 'audit__reason';
      reason.textContent = link.reason;
      anchor.append(anchorText, reason);

      const dest = document.createElement('span');
      dest.className = 'audit__dest';
      const destTitle = document.createElement('strong');
      destTitle.textContent = link.pageTitle;
      const destUrl = document.createElement('span');
      destUrl.className = 'mono';
      destUrl.textContent = link.url.replace('https://juhenza.com', '');
      dest.append(destTitle, destUrl);

      const score = document.createElement('span');
      score.className = 'audit__score';
      const meter = document.createElement('span');
      meter.className = 'audit__meter';
      meter.setAttribute('aria-hidden', 'true');
      const fill = document.createElement('span');
      fill.style.width = `${Math.round(link.score * 100)}%`;
      meter.appendChild(fill);
      const value = document.createElement('b');
      value.textContent = link.score.toFixed(2);
      score.append(meter, value);

      row.append(number, anchor, dest, score);
      audit.appendChild(row);
    });
  }

  function renderDiagnostics(result: AutoLinkResult | null) {
    if (!result || result.diagnostics.length === 0) {
      diag.hidden = true;
      diag.textContent = '';
      return;
    }
    diag.hidden = false;
    diag.textContent = result.diagnostics.join(' · ');
  }

  function markCorpus(result: AutoLinkResult | null) {
    const linked = new Set((result?.links ?? []).map((link) => link.url));
    corpus.querySelectorAll<HTMLElement>('.corpus__row').forEach((row) => {
      const isLinked = linked.has(row.dataset.url ?? '');
      row.classList.toggle('is-linked', isLinked);
      row.querySelector('.corpus__state')?.setAttribute('title', isLinked ? 'Linked from this article' : 'Not linked');
    });
  }

  function updateFooter() {
    recoverButton.disabled = !state.result || state.result.links.length === 0 || state.mode !== 'insert';
    bytesLabel.classList.toggle('proof', state.recovered);

    if (state.recovered) {
      const current = bytes(article.innerHTML);
      const match = current === state.originalBytes;
      bytesLabel.textContent = match
        ? `Original restored · ${formatBytes(current)} → ${formatBytes(state.originalBytes)} · identical`
        : `Restored · ${formatBytes(current)} / ${formatBytes(state.originalBytes)}`;
      return;
    }

    if (!state.result) {
      bytesLabel.textContent = `${formatBytes(state.originalBytes)} in · 0 tags added`;
      return;
    }

    if (state.mode === 'suggest') {
      bytesLabel.textContent = `${formatBytes(state.originalBytes)} in · 0 bytes changed`;
      return;
    }

    bytesLabel.textContent = `${formatBytes(state.originalBytes)} in · ${state.result.links.length} link${state.result.links.length === 1 ? '' : 's'} inserted`;
  }

  function reset(previewMessage = 'Ready.') {
    const scenario = scenarios[state.index];
    renderCorpus();
    state.original = scenario.article;
    state.originalBytes = bytes(scenario.article);
    state.result = null;
    state.recovered = false;
    article.innerHTML = scenario.article;
    article.hidden = state.view === 'html';
    source.hidden = state.view !== 'html';
    renderSource();
    renderAudit(null);
    renderDiagnostics(null);
    markCorpus(null);
    setStats(0, 0, 0, null);
    updateFooter();
    live.textContent = `${previewMessage} ${scenario.pages.length} destination pages loaded.`;
  }

  function setBusy(busy: boolean) {
    state.busy = busy;
    runButton.classList.toggle('is-busy', busy);
    runButton.disabled = busy;
    root.classList.toggle('is-scanning', busy);
  }

  function run() {
    if (state.busy) return;
    const scenario = scenarios[state.index];
    setBusy(true);
    live.textContent = 'Scanning eligible text and scoring candidates…';
    source.hidden = true;
    article.hidden = false;
    article.innerHTML = state.original;
    state.recovered = false;

    window.setTimeout(() => {
      const result = autoLink({
        content: state.original,
        pages: scenario.pages,
        maxLinks: state.maxLinks,
        maxLinksPerParagraph: 2,
        minScore: 0.52,
        mode: state.mode,
      });

      state.result = result;
      article.innerHTML = result.content;
      article.hidden = state.view === 'html';
      source.hidden = state.view !== 'html';
      renderSource();
      renderAudit(result);
      renderDiagnostics(result);
      markCorpus(result);
      setStats(result.links.length, result.candidates, result.skipped, result.elapsed);
      updateFooter();

      live.textContent =
        result.links.length === 0
          ? `No verified links found across ${result.candidates} candidates.`
          : `${result.links.length} link${result.links.length === 1 ? '' : 's'} ${state.mode === 'insert' ? 'inserted' : 'suggested'} · ${result.skipped} candidates rejected · ${result.elapsed.toFixed(1)} ms`;

      setBusy(false);
    }, 520);
  }

  scenarioButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (state.busy) return;
      state.index = Number(button.dataset.scenario);
      scenarioButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      reset(`Loaded “${scenarios[state.index].title}”.`);
    });
  });

  modeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (state.busy) return;
      state.mode = button.dataset.mode === 'suggest' ? 'suggest' : 'insert';
      modeButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      runLabel.textContent = state.mode === 'insert' ? 'Insert links' : 'Find links';      reset(state.mode === 'insert' ? 'Insert mode.' : 'Suggestion-only mode.');
    });
  });

  viewButtons.forEach((button) => {
    button.addEventListener('click', () => {
      state.view = button.dataset.view === 'html' ? 'html' : 'rendered';
      syncView();
      renderSource();
    });
  });

  root.querySelectorAll<HTMLButtonElement>('[data-step]').forEach((button) => {
    button.addEventListener('click', () => {
      if (state.busy) return;
      const delta = button.dataset.step === '+' ? 1 : -1;
      state.maxLinks = Math.min(6, Math.max(1, state.maxLinks + delta));
      maxOutput.textContent = `${state.maxLinks}`;
      reset('Limit updated.');
    });
  });

  recoverButton.addEventListener('click', () => {
    if (!state.result || state.result.links.length === 0) return;
    state.recovered = true;
    article.innerHTML = state.original;
    article.hidden = state.view === 'html';
    source.hidden = state.view !== 'html';
    renderSource();
    updateFooter();
    live.textContent = state.view === 'html'
      ? 'Markup removed. Source restored byte for byte.'
      : `Markup removed. ${formatBytes(state.originalBytes)} restored.`;
    recoverButton.disabled = true;
  });

  runButton.addEventListener('click', run);

  syncView();
  reset();
}
