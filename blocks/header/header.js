
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query that indicates desktop width
const isDesktop = window.matchMedia('(min-width: 900px)');

/* ----------      HELPERS that still apply to desktop drop‑downs      ---------- */

function closeOnEscape(e) {
  if (e.code !== 'Escape') return;

  const nav = document.getElementById('nav');
  const navSections = nav.querySelector('.nav-sections');
  const openSection = navSections.querySelector('[aria-expanded="true"]');

  if (openSection && isDesktop.matches) {
    toggleAllNavSections(navSections);
    openSection.focus();
  }
}

function closeOnFocusLost(e) {
  if (isDesktop.matches && !e.currentTarget.contains(e.relatedTarget)) {
    toggleAllNavSections(e.currentTarget.querySelector('.nav-sections'), false);
  }
}

function openOnKeydown(e) {
  const el = document.activeElement;
  if (el.className !== 'nav-drop') return;
  if (e.code !== 'Enter' && e.code !== 'Space') return;

  const navSections = el.closest('.nav-sections');
  const willOpen = el.getAttribute('aria-expanded') !== 'true';
  toggleAllNavSections(navSections);
  el.setAttribute('aria-expanded', willOpen);
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/* ----------  CORE UTILITY  ---------- */

function toggleAllNavSections(sections, expanded = false) {
  sections
    .querySelectorAll('.nav-sections .default-content-wrapper > ul > li')
    .forEach((li) => li.setAttribute('aria-expanded', expanded));
}

/* ----------  MAIN DECORATE FUNCTION  ---------- */

export default async function decorate(block) {
  /* load nav fragment */
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  /* build nav DOM */
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  /* add semantic classes to each .section (brand, sections, tools, auth …) */
  const sections = nav.querySelectorAll('.section');
  ['brand', 'explore', 'tools', 'auth1','auth2'].forEach((name, i) => {
    if (sections[i]) sections[i].classList.add(`nav-${name}`);
  });

  /* clean up brand link styling */
  const brandLink = nav.querySelector('.nav-brand .button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  /* desktop drop‑downs */
  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections
      .querySelectorAll(':scope .default-content-wrapper > ul > li')
      .forEach((li) => {
        if (li.querySelector('ul')) li.classList.add('nav-drop');
        li.addEventListener('click', () => {
          if (!isDesktop.matches) return;
          const willOpen = li.getAttribute('aria-expanded') !== 'true';
          toggleAllNavSections(navSections);
          li.setAttribute('aria-expanded', willOpen);
        });
      });
  }

  /* desktop‑only keyboard & focus handling */
  if (isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
    navSections
      ?.querySelectorAll('.nav-drop')
      .forEach((d) => d.setAttribute('tabindex', 0));
    nav.addEventListener('focus', focusNavSection, true);
  }

  /* wrap and inject */
  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
