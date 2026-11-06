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
  // Contact icons: Font Awesome Free and Academicons; see LICENSE-icons.txt.
  const icon = {
    email: "<svg aria-hidden=\"true\" focusable=\"false\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><!--! Font Awesome Free 7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2026 Fonticons, Inc. --><path fill=\"currentColor\" d=\"M48 64c-26.5 0-48 21.5-48 48 0 15.1 7.1 29.3 19.2 38.4l208 156c17.1 12.8 40.5 12.8 57.6 0l208-156c12.1-9.1 19.2-23.3 19.2-38.4 0-26.5-21.5-48-48-48L48 64zM0 196L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-188-198.4 148.8c-34.1 25.6-81.1 25.6-115.2 0L0 196z\"/></svg>",
    scholar: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 64 384 384\" aria-hidden=\"true\" focusable=\"false\"><!-- Academicons by James Walsh and contributors; SIL OFL 1.1. Font margins trimmed; glyph outline unchanged. --><path fill=\"currentColor\" d=\"M 343.75868,106.66243 V 79.430205 L 363.52365,63.999997 H 149.63354 L 20.476345,176.2736 h 85.656075 c -0.15534,2.12494 -0.21914,4.04644 -0.21914,6.22563 0,20.84472 7.2192,38.08662 21.67203,51.86089 14.45284,13.79702 32.25124,20.64784 53.32651,20.64784 4.92319,0 9.75059,-0.36794 14.43842,-1.02419 -2.90722,6.50082 -4.37457,12.52302 -4.37457,18.14228 0,9.87526 4.49924,20.4304 13.46715,31.6418 -39.23377,2.6705 -68.06112,9.73264 -86.43702,21.16322 -10.53108,6.49907 -19.000207,14.70396 -25.390349,24.5311 -6.390569,9.89933 -9.577754,20.51525 -9.577754,31.9616 0,9.64822 2.062375,18.33611 6.21907,26.06233 4.156694,7.7263 9.577757,14.07047 16.312223,18.98408 6.71825,4.96781 14.46899,9.10088 23.219,12.46874 8.73429,3.34378 17.40643,5.71858 26.06106,7.06258 8.62707,1.34222 17.20471,1.9985 25.70579,1.9985 13.46887,0 26.95353,-1.73428 40.54711,-5.18707 13.56165,-3.48461 26.28022,-8.64143 38.17105,-15.4927 11.85935,-6.80488 21.51545,-16.0865 28.9219,-27.7183 7.39024,-11.67998 11.09457,-24.80499 11.09457,-39.33613 0,-11.01584 -2.24964,-21.03852 -6.7502,-30.14073 -4.46864,-9.07202 -9.93785,-16.54102 -16.45271,-22.34403 -6.5008,-5.81263 -12.99987,-11.15539 -19.51512,-15.9679 -6.50083,-4.84488 -12.00021,-9.75058 -16.46884,-14.8129 -4.4848,-5.04657 -6.73444,-10.05419 -6.73444,-14.98395 0,-4.92145 1.73422,-9.67183 5.21588,-14.26559 3.45451,-4.6095 7.67376,-9.04795 12.60967,-13.30571 4.93756,-4.24944 9.87523,-8.96788 14.79665,-14.13302 4.92147,-5.14719 9.14072,-11.82739 12.60971,-20.00822 3.48467,-8.17907 5.20318,-17.44489 5.20318,-27.75679 0,-13.4527 -2.54714,-24.46065 -7.54735,-33.31348 -0.59369,-1.02243 -1.21757,-1.80338 -1.87511,-3.02225 l 56.90745,-46.672136 v 17.118526 c -7.39373,0.92969 -6.62422,5.34582 -6.62422,10.6352 v 128.66719 c 0,5.95832 4.8751,10.83382 10.83386,10.83382 h 3.98869 c 5.95835,0 10.83386,-4.87506 10.83386,-10.83382 V 117.29282 c 0,-5.27669 0.77741,-9.68801 -6.56167,-10.63039 z M 236.39865,329.14114 c 1.14099,0.7503 3.7039,2.78075 7.7184,6.03838 4.0495,3.24319 6.797,5.69582 8.26567,7.41432 1.43851,1.66381 3.5792,4.16501 6.37617,7.54734 2.81268,3.3744 4.7184,6.30394 5.71853,8.73425 1.00016,2.4767 2.01603,5.46089 3.04636,8.94556 0.98567,3.44488 1.48486,6.97595 1.48486,10.56169 0,17.04813 -6.56338,29.68007 -19.65604,37.85915 -13.125,8.18083 -28.76651,12.27368 -46.93767,12.27368 -9.18709,0 -18.2031,-1.09289 -27.06247,-3.1951 -8.84322,-2.11665 -17.31192,-5.3362 -25.39035,-9.60185 -8.07846,-4.25771 -14.57754,-10.20337 -19.50072,-17.79659 -4.93764,-7.64012 -7.40645,-16.41464 -7.40645,-26.24962 0,-10.32022 2.79692,-19.28987 8.42233,-26.90588 5.59343,-7.62564 12.93774,-13.3919 22.03208,-17.3154 9.0624,-3.94582 18.24946,-6.74232 27.56166,-8.39827 9.31221,-1.7023 18.79679,-2.555 28.43842,-2.555 4.46862,0 7.93582,0.25115 10.40465,0.69607 0.45456,0.21918 3.03188,2.07025 7.73456,5.56326 4.70401,3.46237 7.62565,5.59519 8.75047,6.38401 z m -3.35823,-100.5779 c -7.40648,8.85938 -17.73454,13.2882 -30.95363,13.2882 -11.85933,0 -22.29766,-4.76482 -31.26554,-14.31195 -8.99984,-9.52309 -15.42235,-20.32803 -19.34408,-32.43061 -3.93752,-12.10871 -5.90585,-23.98423 -5.90585,-35.648 0,-13.6942 3.59542,-25.35184 10.7809,-34.97598 7.18727,-9.64952 17.49915,-14.48477 30.93786,-14.48477 11.87507,0 22.37423,5.03825 31.43704,15.15677 9.09434,10.08482 15.60961,21.41303 19.5169,33.96799 3.92176,12.5392 5.87345,24.52979 5.87345,35.98399 0,13.44658 -3.70256,24.60984 -11.07663,33.45436 z\"/></svg>",
    github: "<svg aria-hidden=\"true\" focusable=\"false\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><!--! Font Awesome Free 7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2026 Fonticons, Inc. --><path fill=\"currentColor\" d=\"M216.5 362.5c-66-8-112.5-55.5-112.5-117 0-25 9-52 24-70-6.5-16.5-5.5-51.5 2-66 20-2.5 47 8 63 22.5 19-6 39-9 63.5-9s44.5 3 62.5 8.5c15.5-14 43-24.5 63-22 7 13.5 8 48.5 1.5 65.5 16 19 24.5 44.5 24.5 70.5 0 61.5-46.5 108-113.5 116.5 17 11 28.5 35 28.5 62.5l0 52C323 491.5 335.5 500 350.5 494 441 459.5 512 369 512 257 512 115.5 397 0 255.5 0S0 115.5 0 257c0 111 70.5 203 165.5 237.5 13.5 5 26.5-4 26.5-17.5l0-40c-7 3-16 5-24 5-33 0-52.5-18-66.5-51.5-5.5-13.5-11.5-21.5-23-23-6-.5-8-3-8-6 0-6 10-10.5 20-10.5 14.5 0 27 9 40 27.5 10 14.5 20.5 21 33 21s20.5-4.5 32-16c8.5-8.5 15-16 21-21z\"/></svg>",
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
