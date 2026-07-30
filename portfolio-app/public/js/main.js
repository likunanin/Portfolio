async function loadContent() {
  const res = await fetch('/api/content');
  if (!res.ok) throw new Error('Could not load content');
  return res.json();
}

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
}

function renderHero(hero) {
  document.getElementById('nav-name').textContent = hero.name;
  document.getElementById('hero-eyebrow').textContent = hero.eyebrow;
  document.getElementById('hero-name').innerHTML = hero.name.replace(' ', '<br>');
  document.getElementById('hero-role').textContent = hero.roleLine;
  document.getElementById('hero-tagline').textContent = hero.tagline;

  const emailLink = document.getElementById('hero-email');
  emailLink.href = `mailto:${hero.email}`;
  const phoneLink = document.getElementById('hero-phone');
  phoneLink.href = `tel:${hero.phone.replace(/\s+/g, '')}`;
  phoneLink.textContent = hero.phone;

  document.getElementById('card-guest').textContent = hero.card.guest;
  document.getElementById('card-status').textContent = hero.card.status;

  const rows = [
    ['Role', hero.card.role],
    ['Property', hero.card.property],
    ['Check-in', hero.card.checkIn],
    ['Conf. No.', hero.card.confNo]
  ];
  const body = document.getElementById('card-body');
  body.innerHTML = '';
  rows.forEach(([k, v]) => {
    const row = el('div', 'rescard-row', `<span class="k">${k}</span><span class="v">${v}</span>`);
    body.appendChild(row);
  });
  body.appendChild(el('div', 'rescard-barcode'));
}

function renderAbout(about) {
  const copy = document.getElementById('about-copy');
  copy.innerHTML = about.paragraphs.map(p => `<p>${p}</p>`).join('');

  const stats = document.getElementById('about-stats');
  stats.innerHTML = '';
  about.stats.forEach(s => {
    stats.appendChild(el('div', 'stat', `<div class="num">${s.num}</div><div class="lbl">${s.label}</div>`));
  });
}

function renderExperience(experience) {
  const wrap = document.getElementById('tickets');
  wrap.innerHTML = '';
  experience.forEach(job => {
    const ticket = el('div', 'ticket reveal');
    ticket.innerHTML = `
      <div class="ticket-stub">
        <div class="dates">${job.dates}</div>
        <div class="gate">${job.gate}</div>
      </div>
      <div class="ticket-perf"></div>
      <div class="ticket-main">
        <div class="role">${job.role}</div>
        <div class="org">${job.org}</div>
        <ul>${job.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
      </div>`;
    wrap.appendChild(ticket);
  });
}

function renderSkills(skills, languages) {
  const tagGrid = document.getElementById('tag-grid');
  tagGrid.innerHTML = '';
  skills.forEach(s => tagGrid.appendChild(el('span', 'tag', s)));

  const langRow = document.getElementById('lang-row');
  langRow.innerHTML = '';
  languages.forEach(l => {
    langRow.appendChild(el('div', 'lang', `
      <div class="lname">${l.name}</div>
      <div class="lbar"><span style="width:${l.percent}%"></span></div>
      <div class="llevel">${l.level}</div>
    `));
  });
}

function renderLearning(education, courses) {
  const eduCard = document.getElementById('edu-card');
  eduCard.innerHTML = `
    <div>
      <div class="deg">${education.degree}</div>
      <div class="school">${education.school}</div>
    </div>
    <div class="when">${education.dates}</div>`;

  const trail = document.getElementById('trail');
  trail.innerHTML = '<div class="trail-line"></div>';
  courses.forEach((c, i) => {
    const item = el('div', `trail-item${c.active ? ' active' : ''}`);
    item.innerHTML = `
      <div class="trail-dot">${String(i + 1).padStart(2, '0')}</div>
      <div class="trail-content">
        <div class="course">${c.course}</div>
        <div class="meta">${c.meta}</div>
        <span class="status">${c.status}</span>
      </div>`;
    trail.appendChild(item);
  });
}

function renderContact(contact) {
  document.getElementById('contact-heading').textContent = contact.heading;
  document.getElementById('contact-blurb').textContent = contact.blurb;
  const links = document.getElementById('contact-links');
  links.innerHTML = '';
  links.appendChild(el('a', '', contact.email)).setAttribute('href', `mailto:${contact.email}`);
  links.appendChild(el('a', '', contact.phone)).setAttribute('href', `tel:${contact.phone.replace(/\s+/g, '')}`);
}

function setupRevealAnimations() {
  const items = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  items.forEach(i => io.observe(i));
}

(async function init() {
  try {
    const data = await loadContent();
    renderHero(data.hero);
    renderAbout(data.about);
    renderExperience(data.experience);
    renderSkills(data.skills, data.languages);
    renderLearning(data.education, data.courses);
    renderContact(data.contact);
    document.getElementById('site-footer').textContent = `${data.hero.name} — ${data.hero.eyebrow}`;
    setupRevealAnimations();
  } catch (err) {
    document.body.innerHTML = `<p class="loading-note" style="padding:40px;">Could not load portfolio content. Is the server running?</p>`;
    console.error(err);
  }
})();
