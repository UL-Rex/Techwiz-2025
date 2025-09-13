// JS working for navbar 


// hamburger or toggle ek hi chiz hai but main ne thora sa mix kia hai 
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

// toggle menu moblie ke liye hai
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');

    const isOpen = navLinks.classList.contains('open');
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

// menu close ho jy ga jb bahar click kare ge
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    }
});

// dropdown ke liye code hai 
(function () {
    const dropdowns = Array.from(document.querySelectorAll('.dropdown'));
    function closeAll(exclude = null) {
        dropdowns.forEach(dd => {
            if (dd === exclude) return;
            dd.classList.remove('open');
            const btn = dd.querySelector('.dropdown-toggle');
            const menu = dd.querySelector('.dropdown-menu');
            if (btn) btn.setAttribute('aria-expanded', 'false');
            if (menu) menu.setAttribute('aria-hidden', 'true');
        });
    }
    function toggleDropdown(dd) {
        const isOpen = dd.classList.toggle('open');
        const btn = dd.querySelector('.dropdown-toggle');
        const menu = dd.querySelector('.dropdown-menu');
        if (btn) btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        if (menu) menu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    }
    dropdowns.forEach(dd => {
        const btn = dd.querySelector('.dropdown-toggle');
        const menu = dd.querySelector('.dropdown-menu');
        btn.addEventListener('click', e => {
            e.stopPropagation();
            const already = dd.classList.contains('open');
            closeAll();
            if (!already) toggleDropdown(dd);
        });
        btn.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
            if (e.key === 'ArrowDown') { e.preventDefault(); closeAll(); toggleDropdown(dd); }
        });
        if (menu) {
            menu.addEventListener('click', e => {
                const target = e.target.closest('[role="menuitem"]');
                if (target) setTimeout(() => closeAll(), 180);
            });
        }
    });
    document.addEventListener('click', e => { if (!e.target.closest('.dropdown')) closeAll(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });
})();

// choti screen ke liye toggle 
(function () {
    const hamburger = document.querySelector('.hamburger');
    const overlay = document.getElementById('mobileOverlay');
    const panel = document.getElementById('mobileMenu');
    const closeBtn = document.getElementById('mobileClose');
    const mobileLinks = Array.from(document.querySelectorAll('.mobile-link'));
    const accordions = Array.from(document.querySelectorAll('.mobile-accordion'));

    function openMenu() {
        document.body.classList.add('no-scroll');
        overlay.classList.add('open');
        panel.classList.add('open');
        hamburger.classList.add('is-open');
        hamburger.setAttribute('aria-expanded', 'true');
        panel.setAttribute('aria-hidden', 'false');
        overlay.setAttribute('aria-hidden', 'false');
        // focus first link in panel for accessibility
        const first = panel.querySelector('.mobile-link, .mobile-accordion-toggle');
        if (first) first.focus();
    }
    function closeMenu() {
        document.body.classList.remove('no-scroll');
        overlay.classList.remove('open');
        panel.classList.remove('open');
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        panel.setAttribute('aria-hidden', 'true');
        overlay.setAttribute('aria-hidden', 'true');
        // close all accordion panels
        accordions.forEach(a => {
            const btn = a.querySelector('.mobile-accordion-toggle');
            const pan = a.querySelector('.panel');
            if (btn) btn.setAttribute('aria-expanded', 'false');
            if (pan) { pan.style.maxHeight = null; pan.setAttribute('aria-hidden', 'true'); }
        });
        // return focus to hamburger
        hamburger.focus();
    }

    // toggle
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = panel.classList.contains('open');
        if (open) closeMenu(); else openMenu();
    });

    // overlay click closes
    overlay.addEventListener('click', closeMenu);
    closeBtn.addEventListener('click', closeMenu);

    // close when clicking any mobile link
    mobileLinks.forEach(a => a.addEventListener('click', () => {
        // small timeout so user sees link press effect
        setTimeout(closeMenu, 80);
    }));

    // accordions
    accordions.forEach(acc => {
        const btn = acc.querySelector('.mobile-accordion-toggle');
        const pan = acc.querySelector('.panel');
        const chev = acc.querySelector('.chev');
        btn.addEventListener('click', () => {
            const expanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', String(!expanded));
            if (!expanded) {
                pan.style.maxHeight = pan.scrollHeight + "px";
                pan.setAttribute('aria-hidden', 'false');
                chev.style.transform = 'rotate(180deg)';
            } else {
                pan.style.maxHeight = null;
                pan.setAttribute('aria-hidden', 'true');
                chev.style.transform = '';
            }
        });
    });

    // close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (panel.classList.contains('open')) closeMenu();
        }
    });

    // if user resizes to desktop, ensure mobile closed
    let resizeTimer = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 860 && panel.classList.contains('open')) closeMenu();
        }, 120);
    });

    // Clicking anywhere outside (on desktop) already handled by dropdown logic above.
})();
