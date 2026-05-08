const project = JSON.parse(document.querySelector('#projectData').textContent);
const mode = document.body.dataset.mode;
const cards = document.querySelector('#cards');
const dynamicSurface = document.querySelector('#dynamicSurface');
const progressList = document.querySelector('#progressList');

function renderCards() {
  cards.innerHTML = project.cards.map((card, index) => `
    <article class="card">
      <span class="status">${project.code}.${index + 1}</span>
      <h3>${card}</h3>
      <p>Practice item for ${project.discipline.toLowerCase()} with local-only content.</p>
    </article>
  `).join('');
}

function renderProgress() {
  progressList.innerHTML = project.features.map((item) => `
    <p><strong>${item.name}</strong></p>
    <div class="bar" aria-label="${item.name} progress"><span style="--value: ${item.score}%"></span></div>
  `).join('');
}

function formSurface() {
  return `
    <form id="demoForm" novalidate>
      <div class="form-grid">
        <label>Full name <input name="fullName" autocomplete="name" required><span class="error"></span></label>
        <label>Student code <input name="studentCode" placeholder="LAB-2026" required><span class="error"></span></label>
        <label>Email <input name="email" type="email" required><span class="error"></span></label>
        <label>Course <select name="course"><option>Computing</option><option>Networks</option></select><span class="error"></span></label>
        <label>Password <input name="password" type="password" required><span class="error"></span></label>
      </div>
      <button type="submit">Validate locally</button>
      <p id="formResult"></p>
    </form>
  `;
}

function defaultSurface() {
  return `
    <ul class="timeline">
      ${project.cards.map((card, index) => `<li><strong>Step ${index + 1}:</strong> ${card}</li>`).join('')}
    </ul>
  `;
}

function careerSurface() {
  const jobs = [
    { role: 'Frontend Intern', skills: ['HTML', 'CSS', 'JavaScript'] },
    { role: 'Support Assistant', skills: ['Troubleshooting', 'Documentation', 'Empathy'] },
    { role: 'Network Trainee', skills: ['Wi-Fi', 'Monitoring', 'Security'] },
    { role: 'Data Assistant', skills: ['CSV', 'Python', 'Charts'] },
  ];
  const counts = new Map();
  jobs.forEach((job) => job.skills.forEach((skill) => counts.set(skill, (counts.get(skill) || 0) + 1)));
  return `
    ${jobs.map((job) => `<article class="card"><h3>${job.role}</h3><p>${job.skills.join(', ')}</p></article>`).join('')}
    <p><strong>Top skills:</strong> ${[...counts.entries()].map(([skill, total]) => `${skill} (${total})`).join(', ')}</p>
  `;
}

function nocSurface() {
  const services = [
    ['Internet link', 'ok', 18],
    ['Learning platform', 'ok', 34],
    ['Lab switch', 'warn', 62],
    ['Wi-Fi classroom', 'ok', 41],
    ['File service', 'bad', 0],
  ];
  return services.map(([name, state, latency]) => `
    <article class="card">
      <span class="status ${state}">${state.toUpperCase()}</span>
      <h3>${name}</h3>
      <p>Latency sample: ${latency} ms</p>
    </article>
  `).join('');
}

function renderDynamicSurface() {
  if (mode === 'form') dynamicSurface.innerHTML = formSurface();
  else if (mode === 'career') dynamicSurface.innerHTML = careerSurface();
  else if (mode === 'noc') dynamicSurface.innerHTML = nocSurface();
  else dynamicSurface.innerHTML = defaultSurface();
}

function wireForm() {
  const form = document.querySelector('#demoForm');
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const rules = {
      fullName: (value) => value.trim().split(/\s+/).length >= 2 || 'Use at least two words.',
      studentCode: (value) => /^LAB-[0-9]{4}$/.test(value) || 'Use the format LAB-2026.',
      email: (value) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value) || 'Use a valid email format.',
      password: (value) => value.length >= 8 || 'Use at least 8 characters.',
    };
    let valid = true;
    for (const [name, rule] of Object.entries(rules)) {
      const input = form.elements[name];
      const result = rule(input.value);
      const error = input.parentElement.querySelector('.error');
      error.textContent = result === true ? '' : result;
      valid = valid && result === true;
    }
    document.querySelector('#formResult').textContent = valid ? 'Local validation passed. Nothing was sent.' : 'Review the highlighted fields.';
  });
}

document.querySelector('#themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

document.querySelector('#exportButton').addEventListener('click', () => {
  const report = `# ${project.title}\n\nCode: ${project.code}\nDiscipline: ${project.discipline}\nMode: ${mode}\n`;
  const blob = new Blob([report], { type: 'text/markdown' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${project.code.toLowerCase()}-report.md`;
  link.click();
  URL.revokeObjectURL(link.href);
});

if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark');
renderCards();
renderProgress();
renderDynamicSurface();
wireForm();
