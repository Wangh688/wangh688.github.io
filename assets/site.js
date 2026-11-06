(function () {
  'use strict';

  const data = window.SITE_DATA;
  if (!data) return;
  const $ = (id) => document.getElementById(id);
  const escape = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  const safeUrl = (value) => {
    if (typeof value !== 'string' || !value.trim()) return '';
    try {
      const url = new URL(value, document.baseURI);
      return ['http:', 'https:', 'mailto:'].includes(url.protocol) ? value : '';
    } catch (_) { return ''; }
  };
  const icon = {
    email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="m3 6 9 7 9-7"/></svg>',
    // Google Scholar mark from Simple Icons (CC0); see LICENSE-simple-icons.txt.
    scholar: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/></svg>',
    github: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M8 20c-4 1-4-2-5-2m10 4v-4a3.5 3.5 0 0 0-1-3c3-.3 6-1.5 6-6a5 5 0 0 0-1-3.5A5 5 0 0 0 17 2s-1-.3-4 1a13 13 0 0 0-6 0C4 1.7 3 2 3 2a5 5 0 0 0 0 3.5A5 5 0 0 0 2 9c0 4.5 3 5.7 6 6a3.5 3.5 0 0 0-1 3v4" transform="translate(2 0) scale(.9)"/></svg>',
    paper: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" aria-hidden="true"><path d="M8 3h11l6 6v20H8Z"/><path d="M19 3v7h6M12 16h9M12 20h9M12 24h6"/></svg>'
  };
  const strings = { noPublications: 'To be updated.', noResults: 'No publications match your search.', all: 'All', search: 'Search publications', filter: 'Filter publications by year', copy: 'Copy', copied: 'Copied', copyFailed: 'Please select and copy the citation below.', scholar: 'Google Scholar', email: 'Email', cv: 'CV', imageUnavailable: 'Preview unavailable' };
  let activeYear = 'all';
  let query = '';
  let observer;
  const t = (key) => strings[key];
  const localized = (value) => String(value ?? '');
  const externalLink = (url, label, className = '') => safeUrl(url) ? `<a class="${className}" href="${escape(safeUrl(url))}" target="_blank" rel="noopener noreferrer">${label}</a>` : label;
  const socialIcon = (url, label, graphic) => {
    const href = safeUrl(url);
    const attributes = `class="social-icon" aria-label="${escape(label)}" title="${escape(label)}${href ? '' : ' (coming soon)'}"`;
    return href
      ? `<a ${attributes} href="${escape(href)}"${href.startsWith('mailto:') ? '' : ' target="_blank" rel="noopener noreferrer"'}>${graphic}</a>`
      : `<span ${attributes} role="link" aria-disabled="true">${graphic}</span>`;
  };
  const publications = Array.isArray(data.publications) ? data.publications.filter((paper) => paper && localized(paper.title).trim()) : [];

  function renderProfile() {
    const profile = data.profile;
    $('name').textContent = profile.name;
    $('role').textContent = `${profile.role} @ ${profile.affiliation}`;
    $('caption-affiliation').textContent = localized(profile.affiliation);
    const biography = profile.biography || [];
    const affiliation = externalLink(profile.affiliationUrl, escape(localized(profile.affiliation)));
    const fallback = `<p>Hi, I am <strong>${escape(profile.name)}</strong>.</p><p>I am an ${escape(localized(profile.role).toLowerCase())} at ${affiliation}.</p>`;
    $('biography').innerHTML = biography.length ? biography.map((paragraph) => `<p>${escape(paragraph)}</p>`).join('') : fallback;
    const email = profile.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email) ? `mailto:${profile.email}` : '';
    const links = [
      socialIcon(profile.github, 'GitHub', icon.github),
      socialIcon(email, t('email'), icon.email),
      socialIcon(profile.scholar, t('scholar'), icon.scholar)
    ];
    if (safeUrl(profile.cv)) links.push(externalLink(profile.cv, `${t('cv')} <span class="external-mark" aria-hidden="true">↗</span>`));
    $('social-links').innerHTML = links.join('');
    $('footer-name').textContent = profile.name;
    $('copyright-year').textContent = new Date().getFullYear();
    const portraitSlot = $('portrait-slot');
    if (safeUrl(profile.portrait) && !portraitSlot.querySelector('img')) {
      const image = document.createElement('img');
      image.src = profile.portrait;
      image.alt = profile.portraitAlt || profile.name;
      image.width = 270;
      image.height = 270;
      image.decoding = 'async';
      image.addEventListener('error', () => {
        image.remove();
        portraitSlot.setAttribute('aria-hidden', 'true');
      });
      portraitSlot.removeAttribute('aria-hidden');
      portraitSlot.append(image);
    }
  }

  function renderResearch() {
    $('research-list').innerHTML = (data.researchInterests || []).map((topic) => `<li>${escape(topic)}</li>`).join('');
  }

  function paperMarkup(paper) {
    const title = localized(paper.title);
    const authorMarkup = (paper.authors || []).map((author) => {
      const name = typeof author === 'string' ? author : author.name;
      const isSelf = author.isSelf || name === data.profile.name;
      const text = `${escape(name)}${typeof author === 'object' && author.marker ? `<sup>${escape(author.marker)}</sup>` : ''}`;
      return isSelf ? `<strong>${text}</strong>` : text;
    }).join(', ');
    const imageUrl = safeUrl(paper.image);
    const figure = imageUrl ? `<img src="${escape(imageUrl)}" alt="${escape(localized(paper.imageAlt) || title)}" loading="lazy" width="400" height="250">` : `<div class="paper-figure-placeholder">${icon.paper}<span>${escape(paper.shortVenue || 'PAPER')}</span></div>`;
    const venue = [localized(paper.venue), paper.year].filter(Boolean).map(escape).join(', ');
    const labels = { pdf: 'PDF', code: 'Code', project: 'Project', dataset: 'Dataset', video: 'Video' };
    const links = Object.entries(labels).filter(([key]) => safeUrl(paper.links?.[key])).map(([key, label]) => externalLink(paper.links[key], label, 'resource-link')).join('');
    const bibtex = paper.bibtex ? `<details class="bibtex"><summary>BibTeX</summary><div class="bibtex-panel"><button type="button" class="copy-citation">${t('copy')}</button><pre><code>${escape(paper.bibtex)}</code></pre></div></details>` : '';
    return `<article class="publication"><div class="paper-figure">${figure}</div><div class="paper-content"><h3 class="paper-title">${externalLink(paper.url || paper.links?.pdf, escape(title))}</h3>${authorMarkup ? `<p class="paper-authors">${authorMarkup}</p>` : ''}${venue ? `<p class="paper-venue"><em>${venue}</em>${(paper.badges || []).map((badge) => `<span class="paper-badge">${escape(badge)}</span>`).join('')}</p>` : ''}${paper.highlight ? `<p class="paper-highlight">${escape(localized(paper.highlight))}</p>` : ''}${paper.description ? `<p class="paper-abstract">${escape(localized(paper.description))}</p>` : ''}<div class="paper-links">${links}${bibtex}</div></div></article>`;
  }

  function renderPapers() {
    const matching = publications.filter((paper) => {
      const text = [localized(paper.title), localized(paper.venue), paper.year, ...(paper.authors || []).map((author) => typeof author === 'string' ? author : author.name)].join(' ').toLocaleLowerCase();
      return (activeYear === 'all' || String(paper.year) === activeYear) && text.includes(query.toLocaleLowerCase().trim());
    });
    $('publication-list').innerHTML = matching.map(paperMarkup).join('');
    $('publication-empty').hidden = matching.length > 0;
    $('publication-empty').textContent = t(publications.length ? 'noResults' : 'noPublications');
    $('publication-tools').hidden = publications.length === 0;
    $('publication-note').hidden = !localized(data.publicationNote);
    $('publication-note').textContent = localized(data.publicationNote);
    document.querySelectorAll('.year-filter').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.year === activeYear)));
    $('publication-list').querySelectorAll('img').forEach((image) => image.addEventListener('error', () => {
      image.parentElement.innerHTML = `<div class="paper-figure-placeholder">${icon.paper}<span>${t('imageUnavailable')}</span></div>`;
    }, { once: true }));
  }

  function renderFilters() {
    const years = [...new Set(publications.map((paper) => String(paper.year || '')).filter(Boolean))].sort((a, b) => Number(b) - Number(a));
    $('year-filters').innerHTML = ['all', ...years].map((year) => `<button type="button" class="year-filter" data-year="${escape(year)}" aria-pressed="${year === activeYear}">${year === 'all' ? t('all') : escape(year)}</button>`).join('');
    $('year-filters').setAttribute('aria-label', t('filter'));
    $('publication-search').placeholder = t('search');
    $('publication-search').setAttribute('aria-label', t('search'));
  }

  function renderOptionalSections() {
    const news = data.news || [];
    $('news-list').hidden = news.length === 0;
    $('news-empty').hidden = news.length > 0;
    $('news-list').innerHTML = news.map((item) => `<li class="news-item"><span class="news-date">${escape(item.date)}</span><p>${externalLink(item.url, escape(localized(item.text)))}</p></li>`).join('');
    const experience = data.experience || [];
    $('experience-list').hidden = experience.length === 0;
    $('experience-empty').hidden = experience.length > 0;
    $('experience-list').innerHTML = experience.map((item) => `<article class="experience-item"><p>${escape(localized(item.period))}</p><h3>${escape(localized(item.title))}</h3><p>${escape(localized(item.organization))}</p>${item.description ? `<p>${escape(localized(item.description))}</p>` : ''}</article>`).join('');
    const awards = data.awards || [];
    $('awards-list').hidden = awards.length === 0;
    $('awards-empty').hidden = awards.length > 0;
    $('awards-list').innerHTML = awards.map((item) => `<li class="news-item"><span class="news-date">${escape(item.year)}</span><p>${escape(localized(item.title))}</p></li>`).join('');
  }

  function render() {
    renderProfile();
    renderResearch();
    renderOptionalSections();
    renderFilters();
    renderPapers();
    observeSections();
  }

  function observeSections() {
    if (!('IntersectionObserver' in window)) return;
    if (observer) observer.disconnect();
    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          document.querySelectorAll('.nav-link').forEach((link) => {
            const active = link.hash === `#${entry.target.id}`;
            link.classList.toggle('active', active);
            if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
          });
        }
      }
    }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
    ['about', 'research', 'publications'].forEach((id) => observer.observe($(id)));
  }

  $('year-filters').addEventListener('click', (event) => {
    const button = event.target.closest('button[data-year]');
    if (!button) return;
    activeYear = button.dataset.year;
    renderPapers();
  });
  $('publication-search').addEventListener('input', (event) => { query = event.target.value; renderPapers(); });
  $('publication-list').addEventListener('click', async (event) => {
    const button = event.target.closest('.copy-citation');
    if (!button) return;
    const code = button.parentElement.querySelector('code');
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(code.textContent);
      button.textContent = t('copied');
      $('announcement').textContent = t('copied');
      setTimeout(() => { button.textContent = t('copy'); }, 1800);
    } catch (_) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(code);
      selection.removeAllRanges();
      selection.addRange(range);
      $('announcement').textContent = t('copyFailed');
      button.textContent = t('copyFailed');
    }
  });
  render();
})();
