/* ==========================================================================
   Nelson Feliciano - shared page behaviour
   Loaded with `defer` on every page.

   1. Mobile overlay menu
   2. Current-page highlighting in the nav
   3. Fade-up reveal as sections enter the viewport
   4. Floating back-to-top button
   ========================================================================== */

(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ----------------------------------------------------------------------
       1. Mobile overlay menu
       ---------------------------------------------------------------------- */
    var toggle = document.querySelector('.nav__toggle');
    var menu = document.getElementById('menu');

    function setMenu(open) {
        if (!toggle || !menu) return;
        toggle.setAttribute('aria-expanded', String(open));
        menu.classList.toggle('is-open', open);
        document.body.classList.toggle('is-locked', open);
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            setMenu(toggle.getAttribute('aria-expanded') !== 'true');
        });

        // Close when a destination is chosen, or on Escape.
        menu.addEventListener('click', function (event) {
            if (event.target.closest('a')) setMenu(false);
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') setMenu(false);
        });

        // The overlay is mobile-only; drop it if the viewport grows past the
        // breakpoint while it happens to be open.
        window.matchMedia('(min-width: 900px)').addEventListener('change', function (event) {
            if (event.matches) setMenu(false);
        });
    }

    /* ----------------------------------------------------------------------
       2. Mark the current page in both navs
       ---------------------------------------------------------------------- */
    var here = window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('.nav__link, .menu a').forEach(function (link) {
        var href = link.getAttribute('href');
        if (!href || href.charAt(0) === '#' || /^https?:/i.test(href)) return;
        if (href.split('/').pop() === here) link.setAttribute('aria-current', 'page');
    });

    /* The Contact links point at the home page section by default. When the
       page being viewed carries its own contact section, scroll to that one
       instead of navigating away. */
    if (document.getElementById('contact')) {
        document.querySelectorAll('a[href$="#contact"]').forEach(function (link) {
            link.setAttribute('href', '#contact');
        });
    }

    /* ----------------------------------------------------------------------
       3. Reveal on scroll
       ---------------------------------------------------------------------- */
    var revealables = document.querySelectorAll('[data-reveal]');

    if (reduceMotion || !('IntersectionObserver' in window)) {
        revealables.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

        revealables.forEach(function (el) { observer.observe(el); });
    }

    /* ----------------------------------------------------------------------
       4. Back to top
       ---------------------------------------------------------------------- */
    var toTop = document.querySelector('.to-top');

    if (toTop) {
        var ticking = false;

        var sync = function () {
            toTop.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
            ticking = false;
        };

        window.addEventListener('scroll', function () {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(sync);
        }, { passive: true });

        sync();
    }
})();
