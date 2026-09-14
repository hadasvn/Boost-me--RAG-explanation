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

  // continuous ken-burns zoom tied to how far you've scrolled through the current step —
  // skipped entirely when the user has asked the OS for reduced motion, not just eased.
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function onScroll() {
    if (reduceMotion) return;
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
    var lastFocused = null;
    function openModal() {
      lastFocused = document.activeElement;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      closeBtn.focus();
      document.addEventListener('keydown', onKeydown);
    }
    function closeModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.removeEventListener('keydown', onKeydown);
      if (lastFocused) lastFocused.focus();
    }
    function onKeydown(e) {
      if (e.key === 'Escape') { closeModal(); return; }
      // simple focus trap: Tab/Shift+Tab cycle only within the two focusable
      // elements the modal actually has (close button, image needs none, so
      // this covers the realistic case — extend if more controls are added).
      if (e.key === 'Tab') {
        e.preventDefault();
        closeBtn.focus();
      }
    }
    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  }
})();
