let currentSkills = [];

/* ---------- Auth ---------- */

async function checkStatus() {
  const res = await fetch('/api/auth/status');
  const data = await res.json();
  return data.authenticated;
}

async function login(password) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Login failed.');
  }
}

async function logout() {
  await fetch('/api/auth/logout', { method: 'POST' });
  location.reload();
}

function showDashboard() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('admin-shell').classList.add('visible');
  loadIntoForm();
}

function showLogin() {
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('admin-shell').classList.remove('visible');
}

/* ---------- Content load/save ---------- */

async function fetchContent() {
  const res = await fetch('/api/content');
  return res.json();
}

async function saveContent(content) {
  const res = await fetch('/api/content', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(content)
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Save failed.');
  }
}

/* ---------- Small helpers ---------- */

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
}

function val(id) { return document.getElementById(id).value; }
function setVal(id, v) { document.getElementById(id).value = v ?? ''; }

/* ---------- Repeatable: About paragraphs ---------- */

function renderParagraphs(paragraphs) {
  const wrap = document.getElementById('about-paragraphs');
  wrap.innerHTML = '';
  paragraphs.forEach((p, i) => {
    const card = el('div', 'item-card');
    card.innerHTML = `
      <div class="item-head"><span>Paragraph ${i + 1}</span><button class="btn-danger" data-remove>Remove</button></div>
      <textarea data-field="paragraph">${p}</textarea>`;
    card.querySelector('[data-remove]').addEventListener('click', () => { card.remove(); });
    wrap.appendChild(card);
  });
}

function collectParagraphs() {
  return [...document.querySelectorAll('#about-paragraphs [data-field="paragraph"]')].map(t => t.value.trim()).filter(Boolean);
}

/* ---------- Repeatable: About stats ---------- */

function renderStats(stats) {
  const wrap = document.getElementById('about-stats');
  wrap.innerHTML = '';
  stats.forEach((s, i) => {
    const card = el('div', 'item-card');
    card.innerHTML = `
      <div class="item-head"><span>Stat ${i + 1}</span><button class="btn-danger" data-remove>Remove</button></div>
      <div class="row2">
        <div><label>Number</label><input type="text" data-field="num" value="${s.num}"></div>
        <div><label>Label</label><input type="text" data-field="label" value="${s.label}"></div>
      </div>`;
    card.querySelector('[data-remove]').addEventListener('click', () => { card.remove(); });
    wrap.appendChild(card);
  });
}

function collectStats() {
  return [...document.querySelectorAll('#about-stats .item-card')].map(card => ({
    num: card.querySelector('[data-field="num"]').value.trim(),
    label: card.querySelector('[data-field="label"]').value.trim()
  })).filter(s => s.num || s.label);
}

/* ---------- Repeatable: Experience ---------- */

function renderExperience(experience) {
  const wrap = document.getElementById('experience-list');
  wrap.innerHTML = '';
  experience.forEach((job, i) => {
    const card = el('div', 'item-card');
    card.innerHTML = `
      <div class="item-head"><span>Position ${i + 1}</span><button class="btn-danger" data-remove>Remove</button></div>
      <div class="row2">
        <div><label>Dates</label><input type="text" data-field="dates" value="${job.dates}"></div>
        <div><label>Gate / location label</label><input type="text" data-field="gate" value="${job.gate}"></div>
      </div>
      <div class="row2">
        <div><label>Role</label><input type="text" data-field="role" value="${job.role}"></div>
        <div><label>Organization</label><input type="text" data-field="org" value="${job.org}"></div>
      </div>
      <label>Bullet points (one per line)</label>
      <textarea data-field="bullets">${job.bullets.join('\n')}</textarea>`;
    card.querySelector('[data-remove]').addEventListener('click', () => { card.remove(); });
    wrap.appendChild(card);
  });
}

function collectExperience() {
  return [...document.querySelectorAll('#experience-list .item-card')].map(card => ({
    dates: card.querySelector('[data-field="dates"]').value.trim(),
    gate: card.querySelector('[data-field="gate"]').value.trim(),
    role: card.querySelector('[data-field="role"]').value.trim(),
    org: card.querySelector('[data-field="org"]').value.trim(),
    bullets: card.querySelector('[data-field="bullets"]').value.split('\n').map(b => b.trim()).filter(Boolean)
  }));
}

/* ---------- Skills (tag chips) ---------- */

function renderSkills(skills) {
  currentSkills = [...skills];
  const wrap = document.getElementById('skills-tags');
  wrap.innerHTML = '';
  currentSkills.forEach((skill, i) => {
    const chip = el('span', 'tag-chip', `${skill} <button data-index="${i}">&times;</button>`);
    chip.querySelector('button').addEventListener('click', () => {
      currentSkills.splice(i, 1);
      renderSkills(currentSkills);
    });
    wrap.appendChild(chip);
  });
}

function addSkillFromInput() {
  const input = document.getElementById('new-skill');
  const value = input.value.trim();
  if (value) {
    currentSkills.push(value);
    renderSkills(currentSkills);
    input.value = '';
  }
  input.focus();
}

/* ---------- Repeatable: Languages ---------- */

function renderLanguages(languages) {
  const wrap = document.getElementById('languages-list');
  wrap.innerHTML = '';
  languages.forEach((lang, i) => {
    const card = el('div', 'item-card');
    card.innerHTML = `
      <div class="item-head"><span>Language ${i + 1}</span><button class="btn-danger" data-remove>Remove</button></div>
      <div class="row3">
        <div><label>Name</label><input type="text" data-field="name" value="${lang.name}"></div>
        <div><label>Level label</label><input type="text" data-field="level" value="${lang.level}"></div>
        <div><label>Bar % (0-100)</label><input type="number" min="0" max="100" data-field="percent" value="${lang.percent}"></div>
      </div>`;
    card.querySelector('[data-remove]').addEventListener('click', () => { card.remove(); });
    wrap.appendChild(card);
  });
}

function collectLanguages() {
  return [...document.querySelectorAll('#languages-list .item-card')].map(card => ({
    name: card.querySelector('[data-field="name"]').value.trim(),
    level: card.querySelector('[data-field="level"]').value.trim(),
    percent: Number(card.querySelector('[data-field="percent"]').value) || 0
  }));
}

/* ---------- Repeatable: Courses ---------- */

function renderCourses(courses) {
  const wrap = document.getElementById('courses-list');
  wrap.innerHTML = '';
  courses.forEach((c, i) => {
    const card = el('div', 'item-card');
    const checkboxId = `course-active-${i}`;
    card.innerHTML = `
      <div class="item-head"><span>Course ${i + 1}</span><button class="btn-danger" data-remove>Remove</button></div>
      <div class="row2">
        <div><label>Course name</label><input type="text" data-field="course" value="${c.course}"></div>
        <div><label>Status label</label><input type="text" data-field="status" value="${c.status}"></div>
      </div>
      <label>Meta (school · dates)</label><input type="text" data-field="meta" value="${c.meta}">
      <div class="checkbox-row">
        <input type="checkbox" id="${checkboxId}" data-field="active" ${c.active ? 'checked' : ''}>
        <label for="${checkboxId}">Currently in progress (highlighted on timeline)</label>
      </div>`;
    card.querySelector('[data-remove]').addEventListener('click', () => { card.remove(); });
    wrap.appendChild(card);
  });
}

function collectCourses() {
  return [...document.querySelectorAll('#courses-list .item-card')].map(card => ({
    course: card.querySelector('[data-field="course"]').value.trim(),
    meta: card.querySelector('[data-field="meta"]').value.trim(),
    status: card.querySelector('[data-field="status"]').value.trim(),
    active: card.querySelector('[data-field="active"]').checked
  }));
}

/* ---------- Load everything into the form ---------- */

let loadedContent = null;

async function loadIntoForm() {
  loadedContent = await fetchContent();
  const c = loadedContent;

  setVal('h-name', c.hero.name);
  setVal('h-eyebrow', c.hero.eyebrow);
  setVal('h-role', c.hero.roleLine);
  setVal('h-tagline', c.hero.tagline);
  setVal('h-email', c.hero.email);
  setVal('h-phone', c.hero.phone);
  setVal('c-guest', c.hero.card.guest);
  setVal('c-status', c.hero.card.status);
  setVal('c-role', c.hero.card.role);
  setVal('c-property', c.hero.card.property);
  setVal('c-checkin', c.hero.card.checkIn);
  setVal('c-confno', c.hero.card.confNo);

  renderParagraphs(c.about.paragraphs);
  renderStats(c.about.stats);
  renderExperience(c.experience);
  renderSkills(c.skills);
  renderLanguages(c.languages);

  setVal('edu-degree', c.education.degree);
  setVal('edu-school', c.education.school);
  setVal('edu-dates', c.education.dates);

  renderCourses(c.courses);

  setVal('ct-heading', c.contact.heading);
  setVal('ct-blurb', c.contact.blurb);
  setVal('ct-email', c.contact.email);
  setVal('ct-phone', c.contact.phone);
}

/* ---------- Collect everything from the form ---------- */

function collectFromForm() {
  return {
    hero: {
      name: val('h-name').trim(),
      eyebrow: val('h-eyebrow').trim(),
      roleLine: val('h-role').trim(),
      tagline: val('h-tagline').trim(),
      email: val('h-email').trim(),
      phone: val('h-phone').trim(),
      card: {
        guest: val('c-guest').trim(),
        status: val('c-status').trim(),
        role: val('c-role').trim(),
        property: val('c-property').trim(),
        checkIn: val('c-checkin').trim(),
        confNo: val('c-confno').trim()
      }
    },
    about: {
      paragraphs: collectParagraphs(),
      stats: collectStats()
    },
    experience: collectExperience(),
    skills: currentSkills,
    languages: collectLanguages(),
    education: {
      degree: val('edu-degree').trim(),
      school: val('edu-school').trim(),
      dates: val('edu-dates').trim()
    },
    courses: collectCourses(),
    contact: {
      heading: val('ct-heading').trim(),
      blurb: val('ct-blurb').trim(),
      email: val('ct-email').trim(),
      phone: val('ct-phone').trim()
    }
  };
}

/* ---------- Save flow ---------- */

async function handleSave() {
  const status = document.getElementById('save-status');
  status.textContent = 'Saving…';
  try {
    const content = collectFromForm();
    await saveContent(content);
    status.textContent = 'Saved ✓ — live on the site';
    setTimeout(() => { if (status.textContent.includes('Saved')) status.textContent = ''; }, 4000);
  } catch (err) {
    status.textContent = `Error: ${err.message}`;
  }
}

/* ---------- Wire up static buttons ---------- */

document.getElementById('login-btn').addEventListener('click', async () => {
  const errorEl = document.getElementById('login-error');
  errorEl.textContent = '';
  try {
    await login(document.getElementById('login-password').value);
    showDashboard();
  } catch (err) {
    errorEl.textContent = err.message;
  }
});

document.getElementById('login-password').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('login-btn').click();
});

document.getElementById('logout-btn').addEventListener('click', logout);
document.getElementById('save-btn').addEventListener('click', handleSave);
document.getElementById('save-btn-bottom').addEventListener('click', handleSave);

document.getElementById('add-paragraph').addEventListener('click', () => {
  const wrap = document.getElementById('about-paragraphs');
  const paragraphs = collectParagraphs();
  paragraphs.push('New paragraph — click to edit.');
  renderParagraphs(paragraphs);
});

document.getElementById('add-stat').addEventListener('click', () => {
  const stats = collectStats();
  stats.push({ num: '0', label: 'New stat' });
  renderStats(stats);
});

document.getElementById('add-experience').addEventListener('click', () => {
  const experience = collectExperience();
  experience.push({ dates: 'MONTH YYYY — MONTH YYYY', gate: 'GATE · CITY', role: 'New Role', org: 'Company, City', bullets: ['Responsibility one'] });
  renderExperience(experience);
});

document.getElementById('add-skill-btn').addEventListener('click', addSkillFromInput);
document.getElementById('new-skill').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { e.preventDefault(); addSkillFromInput(); }
});

document.getElementById('add-language').addEventListener('click', () => {
  const languages = collectLanguages();
  languages.push({ name: 'New Language', level: 'B2', percent: 60 });
  renderLanguages(languages);
});

document.getElementById('add-course').addEventListener('click', () => {
  const courses = collectCourses();
  courses.push({ course: 'New Course', meta: 'School · Dates', status: 'Planned', active: false });
  renderCourses(courses);
});

/* ---------- Init ---------- */

(async function init() {
  const authed = await checkStatus();
  if (authed) showDashboard(); else showLogin();
})();
