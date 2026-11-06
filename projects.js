/* =========================================================================
   KRYZO — /projects directory behaviour
   -------------------------------------------------------------------------
   Reads KRYZO_PROJECTS (see projects-data.js) and renders an interactive
   project directory that REUSES the existing homepage preview interaction
   (image + info + visit button, opened in an animated panel; no navigation).

   Also self-contained helpers (dark mode, clock, mobile menu, scroll-to-top)
   so this page does not depend on the homepage script.js.
   ========================================================================= */
(function () {
  "use strict";

  /* ----------------------------------------------------------------------
     CONFIG
     ---------------------------------------------------------------------- */
  var OG_CACHE_KEY = "kryzo_project_og_v4";
  var OG_CACHE_TTL = 1000 * 60 * 60 * 24 * 7; // 7 days
  var MIN_IMAGE_EDGE = 64; // below this (px) an OG image is treated as a favicon

  var projects = (window.KRYZO_PROJECTS || []).slice();

  /* ----------------------------------------------------------------------
     SMALL UTILS
     ---------------------------------------------------------------------- */
  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function hostOf(url) {
    try {
      return new URL(url).host.replace(/^www\./, "");
    } catch (e) {
      return url;
    }
  }

  function isFallbackSrc(src) {
    return typeof src === "string" && src.indexOf("data:image/svg+xml") === 0;
  }

  function initials(name) {
    return String(name)
      .split(/[\s-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(function (w) { return w[0]; })
      .join("")
      .toUpperCase();
  }

  /* Branded, non-broken SVG fallback (never a broken image icon). */
  function fallbackImage(project) {
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#0b1220"/><stop offset="1" stop-color="#111827"/>' +
      "</linearGradient></defs>" +
      '<rect width="1200" height="675" fill="url(#g)"/>' +
      '<circle cx="1050" cy="120" r="260" fill="#2563eb" opacity="0.18"/>' +
      '<text x="80" y="330" font-family="Segoe UI, Arial, sans-serif" font-size="150" font-weight="700" fill="#ffffff" opacity="0.92">' +
      esc(initials(project.name)) +
      "</text>" +
      '<text x="80" y="410" font-family="Segoe UI, Arial, sans-serif" font-size="46" font-weight="700" fill="#93c5fd">' +
      esc(project.name) +
      "</text>" +
      '<text x="80" y="470" font-family="Segoe UI, Arial, sans-serif" font-size="32" fill="#94a3b8">' +
      esc(hostOf(project.url)) +
      "</text>" +
      "</svg>";
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  /* ----------------------------------------------------------------------
     OG METADATA CACHE
     Verified metadata ships in projects-data.js; this cache stores the
     resolved image per project so repeat visits are instant and we never
     retry an image that already failed.
     ---------------------------------------------------------------------- */
  function readCache() {
    try {
      return JSON.parse(localStorage.getItem(OG_CACHE_KEY) || "{}") || {};
    } catch (e) {
      return {};
    }
  }
  function writeCache(cache) {
    try {
      localStorage.setItem(OG_CACHE_KEY, JSON.stringify(cache));
    } catch (e) { /* storage full / disabled — ignore */ }
  }
  function cacheGet(url) {
    var entry = readCache()[url];
    if (!entry) return null;
    if (Date.now() - entry.ts > OG_CACHE_TTL) return null;
    return entry;
  }
  function cacheSet(url, img, ok) {
    var cache = readCache();
    cache[url] = { img: img, ok: !!ok, ts: Date.now() };
    writeCache(cache);
  }

  /* Resolve the best available preview image for a project. */
  function resolveImage(project) {
    var cached = cacheGet(project.url);
    if (cached) {
      if (cached.ok && cached.img) return cached.img;
      if (!cached.ok) return fallbackImage(project); // known-bad image -> skip reloading it
    }
    if (project.ogImage) return project.ogImage;
    return fallbackImage(project);
  }

  /* Attach load/error handling so previews degrade gracefully. */
  function attachImageGuards(imgEl, project, onStateChange) {
    function fallback() {
      imgEl.src = fallbackImage(project);
      cacheSet(project.url, "", false);
      if (onStateChange) onStateChange("fallback");
    }
    function handleLoad() {
      var src = imgEl.currentSrc || imgEl.src;
      if (isFallbackSrc(src)) {
        if (onStateChange) onStateChange("fallback");
        return;
      }
      var w = imgEl.naturalWidth, h = imgEl.naturalHeight;
      if (w && h && Math.max(w, h) <= MIN_IMAGE_EDGE) {
        fallback(); // favicon-scale image -> branded fallback instead of blur
      } else {
        cacheSet(project.url, src, true);
        if (onStateChange) onStateChange("ready");
      }
    }
    imgEl.addEventListener("load", handleLoad);
    imgEl.addEventListener("error", fallback);
    // Images restored from cache may already be complete (no load event fires).
    if (imgEl.complete && imgEl.naturalWidth) handleLoad();
    return imgEl;
  }

  /* ----------------------------------------------------------------------
     SHARED CHROME (dark mode, clock, year, mobile menu, scroll to top)
     ---------------------------------------------------------------------- */
  function initChrome() {
    var html = document.documentElement;
    var themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
      themeToggle.innerHTML = html.classList.contains("dark")
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
      themeToggle.addEventListener("click", function () {
        html.classList.toggle("dark");
        if (html.classList.contains("dark")) {
          localStorage.theme = "dark";
          themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
          localStorage.theme = "light";
          themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
      });
    }

    var year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();

    var timeDisplay = document.getElementById("local-time");
    if (timeDisplay) {
      var tick = function () {
        timeDisplay.textContent = new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
        });
      };
      tick();
      setInterval(tick, 1000);
    }

    var menuBtn = document.getElementById("mobile-menu-btn");
    var menu = document.getElementById("mobile-menu");
    var closeBtn = document.getElementById("close-menu");
    if (menuBtn && menu && closeBtn) {
      var toggle = function () {
        var isOpen = menu.style.opacity === "1";
        menu.style.opacity = isOpen ? "0" : "1";
        menu.style.pointerEvents = isOpen ? "none" : "auto";
      };
      menuBtn.addEventListener("click", toggle);
      closeBtn.addEventListener("click", toggle);
      document.querySelectorAll(".mobile-link").forEach(function (l) {
        l.addEventListener("click", toggle);
      });
    }

    var topBtn = document.getElementById("scrollToTopBtn");
    if (topBtn) {
      window.addEventListener("scroll", function () {
        if (window.scrollY > 400) {
          topBtn.classList.remove("translate-y-20", "opacity-0");
        } else {
          topBtn.classList.add("translate-y-20", "opacity-0");
        }
      });
      topBtn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  /* ----------------------------------------------------------------------
     DIRECTORY RENDERING
     ---------------------------------------------------------------------- */
  var state = { category: "all", query: "" };
  var grid, emptyState, countEl, loadingEl;
  var hasRendered = false;

  function buildFilters() {
    var wrap = document.getElementById("directory-filters");
    if (!wrap) return;
    var seen = [];
    projects.forEach(function (p) {
      if (p.category && seen.indexOf(p.category) === -1) seen.push(p.category);
    });

    var frag = document.createDocumentFragment();
    var makeBtn = function (value, label) {
      var b = document.createElement("button");
      b.type = "button";
      b.className =
        "filter-btn px-5 py-2 rounded-full border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary transition-all hoverable magnetic-btn";
      if (value === "all") b.classList.add("active");
      b.setAttribute("data-filter", value);
      b.textContent = label;
      b.setAttribute("aria-pressed", value === "all" ? "true" : "false");
      return b;
    };

    frag.appendChild(makeBtn("all", "All"));
    seen.forEach(function (cat) {
      frag.appendChild(makeBtn(cat, cat));
    });
    wrap.innerHTML = "";
    wrap.appendChild(frag);

    wrap.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter-btn");
      if (!btn) return;
      wrap.querySelectorAll(".filter-btn").forEach(function (b) {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
      state.category = btn.getAttribute("data-filter");
      render();
    });
  }

  function matches(project) {
    if (state.category !== "all" && project.category !== state.category) return false;
    var q = state.query.trim().toLowerCase();
    if (!q) return true;
    var haystack = [
      project.name,
      project.shortDescription,
      project.description,
      project.category,
      project.status,
      hostOf(project.url),
      (project.technologies || []).join(" ")
    ]
      .join(" ")
      .toLowerCase();
    return haystack.indexOf(q) !== -1;
  }

  function cardHTML(project) {
    var img = resolveImage(project);
    return (
      '<article class="project-item spotlight-card group cursor-pointer project-trigger reveal-on-scroll hoverable" ' +
      'tabindex="0" role="button" aria-label="Open preview for ' + esc(project.name) + '" ' +
      'data-project-id="' + esc(project.id) + '">' +
      '<div class="spotlight-overlay"></div>' +
      '<div class="project-card relative w-full aspect-[16/10] bg-slate-200 dark:bg-surface rounded-2xl overflow-hidden mb-6 transition-transform duration-300 shadow-lg group-hover:shadow-xl border border-slate-200 dark:border-white/5">' +
      '<div class="absolute inset-0 overflow-hidden transform-gpu">' +
      '<img data-role="card-image" src="' + esc(img) + '" loading="lazy" decoding="async" width="1200" height="900" ' +
      'class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 parallax-img" ' +
      'alt="' + esc(project.name) + ' — preview">' +
      '<div class="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>' +
      "</div>" +
      '<span class="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/85 dark:bg-black/60 backdrop-blur text-slate-700 dark:text-slate-200">' +
      esc(project.status || "Live") +
      "</span>" +
      "</div>" +
      '<div class="flex justify-between items-start border-b border-slate-200 dark:border-white/10 pb-4 relative z-10">' +
      "<div>" +
      '<h3 class="text-2xl font-display font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">' +
      esc(project.name) +
      "</h3>" +
      '<p class="text-slate-500 text-sm">' + esc(project.category) + "</p>" +
      "</div>" +
      '<span class="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all">' +
      '<i class="fas fa-plus group-hover:rotate-90 transition-transform"></i>' +
      "</span>" +
      "</div>" +
      "</article>"
    );
  }

  function render() {
    if (!grid) return;
    var list = projects.filter(matches);

    if (countEl) {
      countEl.innerHTML =
        "Showing <strong class=\"text-slate-900 dark:text-white\">" +
        list.length +
        "</strong> of " +
        projects.length +
        " projects";
    }

    if (!list.length) {
      grid.innerHTML = "";
      grid.classList.add("hidden");
      if (emptyState) emptyState.classList.remove("hidden");
      return;
    }

    grid.classList.remove("hidden");
    if (emptyState) emptyState.classList.add("hidden");
    grid.innerHTML = list.map(cardHTML).join("");

    // Guard every rendered card image (favicon-size -> branded fallback).
    Array.prototype.forEach.call(grid.querySelectorAll(".project-item"), function (item) {
      var project = projects.filter(function (p) {
        return p.id === item.getAttribute("data-project-id");
      })[0];
      var img = item.querySelector('[data-role="card-image"]');
      if (project && img) attachImageGuards(img, project);
    });

    // Staggered reveal on the first paint; instant afterwards (avoids
    // re-animating on every search keystroke).
    var items = grid.querySelectorAll(".project-item");
    items.forEach(function (item, i) {
      if (hasRendered) {
        item.classList.add("reveal-on-scroll", "is-visible");
        return;
      }
      setTimeout(function () {
        item.classList.add("is-visible");
      }, 60 * Math.min(i, 8));
    });
    hasRendered = true;
  }

  function bindSearch() {
    var input = document.getElementById("project-search");
    if (!input) return;
    var onInput = function () {
      state.query = input.value;
      render();
    };
    input.addEventListener("input", onInput);
    var clearBtn = document.getElementById("clear-search");
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        input.value = "";
        state.query = "";
        input.focus();
        render();
      });
    }
  }

  function bindReset() {
    var btn = document.getElementById("reset-filters");
    if (!btn) return;
    btn.addEventListener("click", function () {
      state.category = "all";
      state.query = "";
      var input = document.getElementById("project-search");
      if (input) input.value = "";
      var wrap = document.getElementById("directory-filters");
      if (wrap) {
        wrap.querySelectorAll(".filter-btn").forEach(function (b) {
          b.classList.remove("active");
          if (b.getAttribute("data-filter") === "all") b.classList.add("active");
        });
      }
      render();
    });
  }

  /* ----------------------------------------------------------------------
     PREVIEW PANEL (reuses the existing KRYZO modal interaction)
     ---------------------------------------------------------------------- */
  var preview = {};
  var previewProject = null;
  var lastFocused = null;

  function onPreviewImageLoad() {
    if (!previewProject) return;
    var src = preview.image.currentSrc || preview.image.src;
    if (isFallbackSrc(src)) {
      setImageLoading(false);
      return;
    }
    var w = preview.image.naturalWidth, h = preview.image.naturalHeight;
    if (w && h && Math.max(w, h) <= MIN_IMAGE_EDGE) {
      preview.image.src = fallbackImage(previewProject);
      cacheSet(previewProject.url, "", false);
      return;
    }
    cacheSet(previewProject.url, src, true);
    setImageLoading(false);
  }

  function onPreviewImageError() {
    if (!previewProject) return;
    preview.image.src = fallbackImage(previewProject);
    cacheSet(previewProject.url, "", false);
    setImageLoading(false);
  }

  function bindPreview() {
    preview.modal = document.getElementById("project-modal");
    preview.backdrop = document.getElementById("modal-backdrop");
    preview.panel = document.getElementById("modal-content");
    preview.close = document.getElementById("close-modal");
    preview.image = document.getElementById("modal-image");
    preview.skeleton = document.getElementById("modal-image-skeleton");
    preview.category = document.getElementById("modal-category");
    preview.title = document.getElementById("modal-title");
    preview.desc = document.getElementById("modal-desc");
    preview.tech = document.getElementById("modal-tech");
    preview.domain = document.getElementById("modal-domain");
    preview.status = document.getElementById("modal-status");
    preview.link = document.getElementById("modal-link");
    if (!preview.modal) return;

    grid.addEventListener("click", function (e) {
      var card = e.target.closest(".project-trigger");
      if (card) openPreview(card);
    });
    grid.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " " && e.key !== "Spacebar") return;
      var card = e.target.closest(".project-trigger");
      if (card) {
        e.preventDefault();
        openPreview(card);
      }
    });

    // Bound once — repeated opens must not stack listeners.
    preview.image.addEventListener("load", onPreviewImageLoad);
    preview.image.addEventListener("error", onPreviewImageError);

    preview.close.addEventListener("click", hidePreview);
    preview.backdrop.addEventListener("click", hidePreview);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !preview.modal.classList.contains("hidden")) hidePreview();
      if (e.key === "Tab" && !preview.modal.classList.contains("hidden")) trapFocus(e);
    });
  }

  function trapFocus(e) {
    var focusables = preview.panel.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables.length) return;
    var first = focusables[0];
    var last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function setImageLoading(isLoading) {
    if (preview.skeleton) preview.skeleton.classList.toggle("hidden", !isLoading);
    if (preview.image) preview.image.style.opacity = isLoading ? "0" : "1";
  }

  function openPreview(card) {
    var project = projects.filter(function (p) {
      return p.id === card.getAttribute("data-project-id");
    })[0];
    if (!project) return;

    lastFocused = card;
    previewProject = project;
    preview.category.textContent = project.category;
    preview.title.textContent = project.name;
    preview.desc.textContent = project.description;
    if (preview.domain) preview.domain.textContent = hostOf(project.url);
    if (preview.status) preview.status.textContent = project.status || "Live";

    if (preview.tech) {
      preview.tech.innerHTML = (project.technologies || [])
        .map(function (t) {
          return '<span class="px-3 py-1 bg-slate-100 dark:bg-white/10 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300">' +
            esc(t) + "</span>";
        })
        .join("");
    }
    if (preview.link) preview.link.href = project.url;

    // Image: loading state -> ready / graceful fallback.
    var src = resolveImage(project);
    if (preview.image.getAttribute("src") === src && preview.image.complete && preview.image.naturalWidth) {
      setImageLoading(false);
    } else {
      setImageLoading(true);
      preview.image.src = src;
    }

    preview.modal.classList.remove("hidden");
    setTimeout(function () {
      preview.backdrop.classList.remove("opacity-0");
      preview.panel.classList.remove("scale-95", "opacity-0");
      preview.panel.classList.add("scale-100", "opacity-100");
    }, 10);
    document.body.style.overflow = "hidden";
    setTimeout(function () {
      preview.close.focus();
    }, 60);
  }

  function hidePreview() {
    preview.backdrop.classList.add("opacity-0");
    preview.panel.classList.remove("scale-100", "opacity-100");
    preview.panel.classList.add("scale-95", "opacity-0");
    setTimeout(function () {
      preview.modal.classList.add("hidden");
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    }, 300);
  }

  /* ----------------------------------------------------------------------
     BOOT
     ---------------------------------------------------------------------- */
  function init() {
    initChrome();
    grid = document.getElementById("projects-grid");
    emptyState = document.getElementById("projects-empty");
    countEl = document.getElementById("project-count");
    loadingEl = document.getElementById("projects-loading");

    buildFilters();
    bindSearch();
    bindReset();
    bindPreview();

    var topCount = document.getElementById("project-count-top");
    if (topCount) topCount.textContent = projects.length;

    if (loadingEl) loadingEl.classList.add("hidden");
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
