/* =====================================================================
   Expert Driving Centre — site behaviour (used by every page)

   This file only makes things *work* — all the words, prices and
   contact details are in the .html pages. You won't normally need to
   edit anything here.

     Mobile menu · FAQ open/close · fade-in on scroll · back-to-top
     Package swiper on phones · Contact form sending · Footer year
   ===================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var phoneSize = window.matchMedia("(max-width: 767px)");

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("main-menu");

  function setMenu(open) {
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("menu-open", open);
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () { setMenu(!menu.classList.contains("is-open")); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) { setMenu(false); toggle.focus(); }
    });
    // if the screen is rotated / resized to desktop, don't leave the page locked
    window.matchMedia("(min-width: 960px)").addEventListener("change", function () { setMenu(false); });
  }

  /* ---------- FAQ accordion ---------- */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".faq__q");
    if (!btn) return;
    var open = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!open));
    document.getElementById(btn.getAttribute("aria-controls")).hidden = open;
  });

  /* ---------- Fade sections in as they scroll into view ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Scroll line, header shadow, back-to-top ---------- */
  var progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);
  var header = document.querySelector(".site-header");
  var toTop = document.querySelector(".to-top");
  var ticking = false;

  function onScroll() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    var y = window.scrollY;
    if (progress) progress.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
    if (header) header.classList.toggle("is-scrolled", y > 10);
    if (toTop) toTop.classList.toggle("is-visible", y > 600);
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- Package cards: swipe row with dots on phones ---------- */
  document.querySelectorAll(".pricing-grid").forEach(function (grid) {
    var cards = Array.prototype.slice.call(grid.children);
    if (cards.length < 2) return;

    var dots = document.createElement("div");
    dots.className = "carousel-dots";
    dots.innerHTML = '<span class="carousel-dots__hint">Swipe to compare</span>';
    cards.forEach(function (card, i) {
      var b = document.createElement("button");
      var name = card.querySelector(".price-card__name");
      b.type = "button";
      b.setAttribute("aria-label", "Show " + (name ? name.textContent : "package " + (i + 1)));
      b.addEventListener("click", function () { goTo(i); });
      dots.appendChild(b);
    });
    grid.after(dots);

    function goTo(i, instant) {
      var c = cards[i];
      grid.scrollTo({
        left: c.offsetLeft - (grid.clientWidth - c.clientWidth) / 2,
        behavior: instant || reduceMotion ? "auto" : "smooth"
      });
    }

    function update() {
      var centre = grid.scrollLeft + grid.clientWidth / 2;
      var best = 0, bestDist = Infinity;
      cards.forEach(function (c, i) {
        var d = Math.abs(c.offsetLeft + c.clientWidth / 2 - centre);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      dots.querySelectorAll("button").forEach(function (d, i) {
        d.setAttribute("aria-current", i === best ? "true" : "false");
      });
    }

    grid.addEventListener("scroll", function () { requestAnimationFrame(update); }, { passive: true });

    function init() {
      if (phoneSize.matches) {
        // open on the "Most popular" card if there is one
        var start = cards.findIndex(function (c) { return c.classList.contains("price-card--popular"); });
        goTo(start > -1 ? start : 0, true);
      }
      update();
    }
    window.addEventListener("load", init);
    phoneSize.addEventListener("change", init);
  });

  /* ---------- Contact form (contact.html) ----------
     Sent through Web3Forms. The access_key is in the form itself. */
  var form = document.getElementById("contact-form");
  if (form) {
    var status = document.getElementById("form-status");
    var submitBtn = form.querySelector('button[type="submit"]');
    var callUs = "call us on 0430 512 726";

    // "Book now" on a package links to contact.html?package=Name — pre-select it
    var picked = new URLSearchParams(location.search).get("package");
    if (picked && form.elements["package"]) form.elements["package"].value = picked;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      var label = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
      showStatus("", "");

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form)
      })
        .then(function (res) { return res.json(); })
        .then(function (json) {
          if (json.success) {
            showStatus("ok", "Thanks! Your message has been sent — we'll get back to you shortly.");
            form.reset();
          } else {
            showStatus("err", json.message || "Something went wrong. Please try again or " + callUs + ".");
          }
        })
        .catch(function () {
          showStatus("err", "Couldn't send — check your connection, or " + callUs + ".");
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = label;
        });
    });

    function showStatus(type, msg) {
      status.className = "form-status" + (type ? " form-status--" + type : "");
      status.textContent = msg;
      if (msg) status.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }
})();
