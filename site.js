/* nomad.ax — the little script every page shares. Everything here is an
 * enhancement: each page reads and works without it.
 *
 * The first law: nothing in this file runs per frame. The scroll scene flips
 * one data attribute when a quarter of the section crosses the middle of the
 * screen, and CSS does the moving on the compositor. */
(function () {
  'use strict';

  /* ── The scroll scene (AX): one desk, the light changes ─────────────── */

  function scenes() {
    var all = document.querySelectorAll('[data-scene]');
    if (!all.length || !('IntersectionObserver' in window)) return;

    Array.prototype.forEach.call(all, function (scene) {
      var walls = scene.querySelectorAll('.desk-wall');

      // Prepare the destination first: every wallpaper is decoded while the
      // scene is still a screen away, so no step pays for a decode mid-fade.
      var warm = new IntersectionObserver(function (entries) {
        if (!entries.some(function (e) { return e.isIntersecting; })) return;
        warm.disconnect();
        Array.prototype.forEach.call(walls, function (img) {
          if (img.decode) img.decode().catch(function () {});
        });
      }, { rootMargin: '100% 0px' });
      warm.observe(scene);

      var steps = scene.querySelectorAll('.scene-steps > i');
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var i = Array.prototype.indexOf.call(steps, e.target);
          if (scene.getAttribute('data-step') !== String(i)) scene.setAttribute('data-step', String(i));
        });
      }, { rootMargin: '-50% 0px -50% 0px' });
      Array.prototype.forEach.call(steps, function (s) { io.observe(s); });
    });
  }

  /* ── Downloads: what exists is asked for, not baked in ──────────────── */

  /**
   * Which build this machine wants. `navigator.userAgentData` is the only
   * honest source on Windows on ARM: the classic user-agent string reports an
   * ARM64 machine as `Win64; x64` on purpose. Without the modern API we
   * recommend nothing rather than guess wrong.
   */
  function detectArch() {
    var d = navigator.userAgentData;
    if (d && typeof d.getHighEntropyValues === 'function') {
      return d.getHighEntropyValues(['architecture']).then(function (v) {
        if (v.architecture === 'arm') return 'arm64';
        if (v.architecture === 'x86') return 'x64';
        return null;
      }).catch(function () { return null; });
    }
    return Promise.resolve(null);
  }

  function mb(bytes) {
    return bytes ? Math.round(bytes / 1024 / 1024) + ' MB' : '';
  }

  function downloads() {
    var cards = document.querySelectorAll('[data-product]');
    if (!cards.length || !window.fetch) return;

    var manifest = fetch('/dl/manifest?product=all', { headers: { Accept: 'application/json' } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });

    Promise.all([manifest, detectArch()]).then(function (r) {
      var m = r[0];
      var arch = r[1];
      // No answer (offline, or previewing without the functions): leave the
      // links as they are. They point at /dl/<product>/<arch>, which says in
      // plain words when a build is not out yet.
      if (!m || !m.products) return;

      Array.prototype.forEach.call(cards, function (card) {
        var info = m.products[card.getAttribute('data-product')];
        if (!info) return;
        var version = card.querySelector('[data-version]');
        if (version) version.textContent = info.version ? 'Version ' + info.version : 'Not released yet';

        Array.prototype.forEach.call(card.querySelectorAll('[data-arch]'), function (link) {
          var a = link.getAttribute('data-arch');
          var build = info.builds && info.builds[a];
          var tag = link.querySelector('.dl-tag');
          var meta = link.querySelector('.dl-meta');
          if (build && build.url) {
            link.href = build.url;
            if (meta && build.size) meta.textContent = meta.getAttribute('data-base') + ' · ' + mb(build.size);
            if (a === arch) {
              link.classList.add('match');
              if (tag) tag.textContent = 'For this PC';
            }
          } else {
            link.classList.add('pending');
            link.removeAttribute('href');
            link.setAttribute('aria-disabled', 'true');
            if (tag) tag.textContent = 'Soon';
          }
        });
      });
    });
  }

  /* ── The small-screen menu closes when you pick something or press Esc ─ */

  function menu() {
    var m = document.querySelector('.menu');
    if (!m) return;
    m.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('.menu-sheet a')) m.removeAttribute('open');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && m.hasAttribute('open')) {
        m.removeAttribute('open');
        m.querySelector('summary').focus();
      }
    });
  }

  scenes();
  downloads();
  menu();
})();
