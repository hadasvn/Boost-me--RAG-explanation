const scenes = [...document.querySelectorAll('.scene')];
const dotsNav = document.querySelector('.dots');

scenes.forEach((s, i) => {
  const b = document.createElement('button');
  b.setAttribute('aria-label', 'סצנה ' + (i + 1));
  b.addEventListener('click', () => s.scrollIntoView({ behavior: 'smooth' }));
  dotsNav.appendChild(b);
});
const dotButtons = [...dotsNav.children];
if (dotButtons[0]) dotButtons[0].classList.add('active');

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const i = scenes.indexOf(entry.target);
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      dotButtons.forEach(b => b.classList.remove('active'));
      dotButtons[i].classList.add('active');
    } else {
      entry.target.classList.remove('active');
    }
  });
}, { threshold: 0.5 });
scenes.forEach(s => io.observe(s));

const modal = document.getElementById('depth-modal');
document.getElementById('depth-open').addEventListener('click', () => modal.classList.add('open'));
document.getElementById('depth-close').addEventListener('click', () => modal.classList.remove('open'));
modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });
