const nav = document.querySelector<HTMLElement>('.nav');
if (nav) {
  const sync = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
  sync();
  window.addEventListener('scroll', sync, { passive: true });
}

const navToggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
if (nav && navToggle) {
  const label = navToggle.querySelector<HTMLElement>('[data-nav-label]');
  const setOpen = (open: boolean) => {
    nav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    if (label) label.textContent = open ? 'Close' : 'Menu';
  };

  navToggle.addEventListener('click', () => {
    setOpen(!nav.classList.contains('is-open'));
  });

  nav.querySelectorAll<HTMLAnchorElement>('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      navToggle.focus();
    }
  });

  document.addEventListener('pointerdown', (event) => {
    if (!nav.classList.contains('is-open')) return;
    if (event.target instanceof Node && !nav.contains(event.target)) setOpen(false);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 820) setOpen(false);
  });
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealables = document.querySelectorAll<HTMLElement>('.reveal');

if (!reduceMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.06 },
  );
  revealables.forEach((element) => observer.observe(element));
} else {
  revealables.forEach((element) => element.classList.add('is-in'));
}

document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const target = document.getElementById(button.dataset.copy ?? '');
    if (!target) return;
    const value = target.innerText;
    const label = button.querySelector('span');
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const helper = document.createElement('textarea');
      helper.value = value;
      helper.style.position = 'fixed';
      helper.style.opacity = '0';
      document.body.appendChild(helper);
      helper.select();
      document.execCommand('copy');
      helper.remove();
    }
    if (label) {
      const previous = label.textContent;
      label.textContent = 'Copied';
      window.setTimeout(() => {
        label.textContent = previous;
      }, 1600);
    }
  });
});

document.querySelectorAll<HTMLElement>('[data-tabs]').forEach((group) => {
  const buttons = Array.from(group.querySelectorAll<HTMLButtonElement>('[data-tab-target]'));
  const panels = Array.from(group.querySelectorAll<HTMLElement>('[data-tab-panel]'));

  const select = (target: string) => {
    buttons.forEach((button) => {
      const active = button.dataset.tabTarget === target;
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    });
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.tabPanel !== target;
    });
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => select(button.dataset.tabTarget ?? ''));
    button.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      const current = buttons.findIndex((item) => item.dataset.tabTarget === button.dataset.tabTarget);
      const next = (current + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
      buttons[next].focus();
      select(buttons[next].dataset.tabTarget ?? '');
    });
  });

  if (buttons.length) select(buttons[0].dataset.tabTarget ?? '');
});
