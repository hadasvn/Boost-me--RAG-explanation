(function () {
  // generic wiring for any <dialog id="X-modal"> paired with a button#X-open and
  // button#X-close — native <dialog>.showModal() gives focus trapping and
  // Escape-to-close for free, so no manual focus management needed here.
  var names = ['a11y', 'privacy', 'terms'];
  names.forEach(function (name) {
    var modal = document.getElementById(name + '-modal');
    var openBtn = document.getElementById(name + '-open');
    var closeBtn = document.getElementById(name + '-close');
    if (!modal || !openBtn || !closeBtn) return;
    openBtn.addEventListener('click', function () { modal.showModal(); });
    closeBtn.addEventListener('click', function () { modal.close(); });
    modal.addEventListener('click', function (e) {
      if (e.target === modal) modal.close();
    });
  });
})();
