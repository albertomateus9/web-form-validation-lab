const data = JSON.parse(document.querySelector('#projectData').textContent);
const cards = document.querySelector('#cards');
const surface = document.querySelector('#dynamicSurface');
const progress = document.querySelector('#progressList');

function renderCards() {
  cards.innerHTML = data.cards.map((card, index) => `
    <article class="card">
      <strong>${index + 1}. ${card}</strong>
      <span>${data.features[index % data.features.length] || 'prática guiada'}</span>
    </article>
  `).join('');
}

function renderSurface() {
  surface.innerHTML = `
    <div class="lab-surface">
      <h3>${data.title}</h3>
      <p>${data.description}</p>
      <div>
        ${data.features.map((feature) => `<span class="pill">${feature}</span>`).join('')}
      </div>
    </div>
  `;
  progress.innerHTML = data.features.map((feature, index) => `
    <div class="metric"><strong>${index + 1}</strong><span>${feature}</span></div>
  `).join('');
}

function exportReport() {
  const lines = [
    `# Relatório - ${data.title}`,
    '',
    `Código: ${data.code}`,
    `Curso: ${data.course}`,
    `Disciplina: ${data.discipline}`,
    '',
    '## Evidências',
    ...data.features.map((feature) => `- ${feature}`),
    '',
    'Dados sintéticos, locais e sem backend.'
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'relatorio-laboratorio.md';
  a.click();
  URL.revokeObjectURL(url);
}

document.querySelector('#themeToggle').addEventListener('click', () => document.body.classList.toggle('high-contrast'));
document.querySelector('#exportButton').addEventListener('click', exportReport);
renderCards();
renderSurface();
