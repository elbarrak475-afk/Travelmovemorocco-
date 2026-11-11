/**
 * TravelMoveMorocco — Core Client Script
 * Clean, modular, and production-ready script handling:
 * 1. Mobile navigation toggle (accessible hamburger menu)
 * 2. Smooth scrolling for internal anchor links with sticky header offset
 * 3. Dynamic guides grid rendering
 * 4. Free e-book lead magnet form
 * 5. Newsletter subscription enhancement
 * 6. Reading progress bar on article pages
 */

(() => {
  'use strict';

  // ---------------------------------------------------------------------------
  // Configuration & Data
  // ---------------------------------------------------------------------------
  // Free e-book lead magnet. Set LEAD_ENDPOINT to your email provider's form/API URL
  // (Mailchimp, ConvertKit, Formspree...) so addresses are actually collected.
  const LEAD_ENDPOINT = '';
  const SITE_BASE = document.currentScript ? new URL('.', document.currentScript.src).href : '';
  const EBOOK_URL = SITE_BASE ? `${SITE_BASE}downloads/morocco-7-day-itinerary.pdf` : '';

  const ARTICLES = [
    ['asilah-travel-guide', 'Asilah Travel Guide: Medina, Murals & Atlantic Beaches (2026)', 'Discover Asilah’s whitewashed medina, street art, Atlantic beaches, and riads.', 'Asilah'],
    ['marrakech-travel-guide', 'Marrakech Travel Guide: Medina, Souks & Where to Stay (2026)', 'Plan Marrakech with our guide to the medina, souks, riads, food and day trips.', 'Marrakech'],
    ['fes-travel-guide', "Fes Medina Guide: How to Explore the World's Largest Car-Free Maze", 'Navigate the Fes el-Bali medina, tanneries and madrasas without getting lost.', 'Fes'],
    ['chefchaouen-travel-guide', 'Chefchaouen Blue City Guide: Photo Spots, Hikes & Stays', "Everything for visiting Morocco's blue pearl: best streets, hikes and riads.", 'Chefchaouen'],
    ['casablanca-things-to-do', 'Casablanca Things to Do: Hassan II Mosque, Corniche & Food', 'Beyond the airport: top Casablanca sights, art deco walks and seafood.', 'Casablanca'],
    ['merzouga-desert-guide', 'Merzouga Sahara Desert Tour: Camel Treks & Luxury Camps', 'How to book a Merzouga desert trip, what to pack and the best season.', 'Merzouga'],
    ['essaouira-travel-guide', 'Essaouira Travel Guide: Wind, Walls & Fresh Seafood', 'Wander Essaouira’s ramparts, port and beaches with this relaxed coastal guide.', 'Essaouira'],
  ];

  // ---------------------------------------------------------------------------
  // Module 1: Responsive Mobile Navigation
  // ---------------------------------------------------------------------------
  const initMobileNavigation = () => {
    const siteHeader = document.querySelector('header.site');
    if (!siteHeader) return;

    let nav = siteHeader.querySelector('nav');
    if (!nav) return;

    let toggleBtn = siteHeader.querySelector('.menu-toggle, #menu-toggle');

    // Auto-create hamburger button if omitted from markup for resilience
    if (!toggleBtn) {
      toggleBtn = document.createElement('button');
      toggleBtn.type = 'button';
      toggleBtn.className = 'menu-toggle';
      toggleBtn.id = 'menu-toggle';
      toggleBtn.setAttribute('aria-label', 'Toggle navigation menu');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.innerHTML = `
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      `;
      nav.parentNode.insertBefore(toggleBtn, nav);
    }

    if (!nav.id) {
      nav.id = 'primary-nav';
    }
    toggleBtn.setAttribute('aria-controls', nav.id);

    // Menu state helpers
    const openMenu = () => {
      toggleBtn.setAttribute('aria-expanded', 'true');
      siteHeader.classList.add('nav-open');
      nav.classList.add('is-open');
      document.body.classList.add('menu-locked');
    };

    const closeMenu = () => {
      toggleBtn.setAttribute('aria-expanded', 'false');
      siteHeader.classList.remove('nav-open');
      nav.classList.remove('is-open');
      document.body.classList.remove('menu-locked');
    };

    const toggleMenu = () => {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    };

    // Toggle button click
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close when clicking any navigation link
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        closeMenu();
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (siteHeader.classList.contains('nav-open') && !siteHeader.contains(e.target)) {
        closeMenu();
      }
    });

    // Keyboard accessibility: close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && siteHeader.classList.contains('nav-open')) {
        closeMenu();
        toggleBtn.focus();
      }
    });

    // Reset when resizing past mobile breakpoint
    const desktopMedia = window.matchMedia('(min-width: 681px)');
    desktopMedia.addEventListener('change', (e) => {
      if (e.matches) {
        closeMenu();
      }
    });
  };

  // ---------------------------------------------------------------------------
  // Module 2: Smooth Scrolling for Internal Links
  // ---------------------------------------------------------------------------
  const initSmoothScroll = () => {
    // Intercept internal page hash links
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      const hash = anchor.getAttribute('href');
      // Ignore standalone '#' or buy buttons handled separately
      if (!hash || hash === '#' || anchor.hasAttribute('data-buy')) return;

      const targetElement = document.querySelector(hash);
      if (!targetElement) return;

      e.preventDefault();

      // Account for sticky header height
      const header = document.querySelector('header.site');
      const headerOffset = header ? header.offsetHeight : 0;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Update URL hash without harsh jumping
      if (history.pushState) {
        history.pushState(null, '', hash);
      } else {
        window.location.hash = hash;
      }

      // Accessibility: manage focus so screen readers follow jump
      targetElement.setAttribute('tabindex', '-1');
      targetElement.focus({ preventScroll: true });
    });
  };

  // ---------------------------------------------------------------------------
  // Module 3: Guides Grid Rendering
  // ---------------------------------------------------------------------------
  const initGuidesGrid = () => {
    const grid = document.getElementById('grid');
    if (!grid) return;

    // Preserve statically rendered cards in index.html to ensure all linked files exist
    if (grid.children.length > 0) return;

    // Fallback dynamic population if grid is initially empty
    grid.innerHTML = ARTICLES.map(([slug, title, excerpt, category]) => `
      <article class="card">
        <div class="image-placeholder" role="img" aria-label="${title} image placeholder">[ Insert Image Here ]</div>
        <div class="b">
          <span class="tag">${category}</span>
          <h3><a href="articles/${slug}.html">${title}</a></h3>
          <p>${excerpt}</p>
        </div>
      </article>
    `).join('');
  };

  // ---------------------------------------------------------------------------
  // Module 4: E-Book Lead Magnet Form
  // ---------------------------------------------------------------------------
  const initCheckoutHandler = () => {
    const forms = document.querySelectorAll('[data-lead-form]');
    forms.forEach((form) => {
      const input = form.querySelector('input[type="email"]');
      const button = form.querySelector('button[type="submit"]');
      const status = form.parentElement.querySelector('.lead-status');
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      const setStatus = (message, type) => {
        if (!status) return;
        status.textContent = '';
        status.className = 'lead-status' + (type ? ` is-${type}` : '');
        status.append(message);
        return status;
      };

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = input.value.trim();
        if (!emailPattern.test(email)) {
          setStatus('Please enter a valid email address.', 'error');
          input.focus();
          return;
        }

        const label = button.textContent;
        button.disabled = true;
        button.textContent = 'Sending…';

        try {
          if (LEAD_ENDPOINT) {
            const res = await fetch(LEAD_ENDPOINT, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, source: 'ebook-lead-magnet' })
            });
            if (!res.ok) throw new Error('Request failed');
          }

          form.reset();
          const el = setStatus('✓ Thank you! Your free e-book is on its way to your inbox. ', 'success');
          if (EBOOK_URL && el) {
            const link = document.createElement('a');
            link.href = EBOOK_URL;
            link.textContent = 'Download it instantly';
            link.setAttribute('download', '');
            el.append(link, '.');
          }
        } catch (err) {
          setStatus('Something went wrong. Please try again in a moment.', 'error');
        } finally {
          button.disabled = false;
          button.textContent = label;
        }
      });
    });
  };

  // ---------------------------------------------------------------------------
  // Module 5: Progressive Newsletter Form
  // ---------------------------------------------------------------------------
  const initNewsletterForm = () => {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      if (!emailInput || !emailInput.value.trim()) return;

      const originalBtn = form.querySelector('button[type="submit"]');
      const originalText = originalBtn ? originalBtn.textContent : 'Subscribe';

      if (originalBtn) {
        originalBtn.textContent = 'Subscribed!';
        originalBtn.disabled = true;
      }

      emailInput.value = '';

      setTimeout(() => {
        if (originalBtn) {
          originalBtn.textContent = originalText;
          originalBtn.disabled = false;
        }
      }, 3500);
    });
  };

  // ---------------------------------------------------------------------------
  // Module 5b: Contact Form
  // ---------------------------------------------------------------------------
  const initContactForm = () => {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = form.querySelector('.form-status');
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn ? btn.textContent : 'Send message';

      if (btn) {
        btn.textContent = 'Message sent!';
        btn.disabled = true;
      }
      if (status) {
        status.textContent = '✓ Thank you! We\'ll get back to you within 24 hours.';
        status.className = 'form-status is-success';
      }

      form.reset();

      setTimeout(() => {
        if (btn) {
          btn.textContent = originalText;
          btn.disabled = false;
        }
      }, 3500);
    });
  };

  // ---------------------------------------------------------------------------
  // Module 6: Reading Progress Bar (article pages only)
  // ---------------------------------------------------------------------------
  const initReadingProgress = () => {
    const article = document.querySelector('body > article');
    if (!article) return;

    let bar = document.querySelector('.reading-progress');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'reading-progress';
      bar.setAttribute('role', 'progressbar');
      bar.setAttribute('aria-label', 'Reading progress');
      bar.setAttribute('aria-valuemin', '0');
      bar.setAttribute('aria-valuemax', '100');
      bar.innerHTML = '<div class="reading-progress__bar"></div>';
      document.body.insertBefore(bar, document.body.firstChild);
    }
    const fill = bar.querySelector('.reading-progress__bar');
    let ticking = false;

    const update = () => {
      ticking = false;
      const rect = article.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const ratio = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : (rect.bottom <= window.innerHeight ? 1 : 0);
      fill.style.transform = `scaleX(${ratio})`;
      bar.setAttribute('aria-valuenow', String(Math.round(ratio * 100)));
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  };

  // ---------------------------------------------------------------------------
  // Initialization Lifecycle
  // ---------------------------------------------------------------------------
  const init = () => {
    initReadingProgress();
    initMobileNavigation();
    initSmoothScroll();
    initGuidesGrid();
    initCheckoutHandler();
    initNewsletterForm();
    initContactForm();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
