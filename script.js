(function () {
  var stage = document.getElementById('stage');
  var track = document.getElementById('track');
  if (!stage || !track) return;

  var steps = Array.prototype.slice.call(track.querySelectorAll('.step'));
  var layers = Array.prototype.slice.call(stage.querySelectorAll('.layer'));
  var bgs = Array.prototype.slice.call(stage.querySelectorAll('.layer .bg'));
  var dots = document.getElementById('progress');

  steps.forEach(function () { dots.appendChild(document.createElement('i')); });
  var dotEls = Array.prototype.slice.call(dots.children);

  function setActive(i) {
    layers.forEach(function (l) {
      l.classList.toggle('on', Number(l.getAttribute('data-i')) === i);
    });
    dotEls.forEach(function (d, idx) { d.classList.toggle('on', idx === i); });
  }

  var current = 0;
  setActive(0);

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting && e.intersectionRatio > 0.5) {
        current = Number(e.target.getAttribute('data-i'));
        setActive(current);
      }
    });
  }, { threshold: [0, 0.5, 1] });
  steps.forEach(function (s) { io.observe(s); });

  // continuous ken-burns zoom tied to how far you've scrolled through the current step
  function onScroll() {
    var el = steps[current];
    if (!el) return;
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight;
    var progress = Math.min(1, Math.max(0, (vh - r.top) / (r.height + vh)));
    var scale = 1 + progress * 0.045;
    var bg = bgs[current];
    if (bg) bg.style.transform = 'scale(' + scale.toFixed(3) + ')';
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () { onScroll(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  var modal = document.getElementById('depth-modal');
  var openBtn = document.getElementById('depth-open');
  var closeBtn = document.getElementById('depth-close');
  if (modal && openBtn && closeBtn) {
    openBtn.addEventListener('click', function () { modal.classList.add('open'); });
    closeBtn.addEventListener('click', function () { modal.classList.remove('open'); });
    modal.addEventListener('click', function (e) { if (e.target === modal) modal.classList.remove('open'); });
  }
})();
