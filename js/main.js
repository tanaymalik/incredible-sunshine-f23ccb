(function () {
  "use strict";

  // Header scroll state
  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile nav toggle
  var toggle = document.getElementById("navToggle");
  var panel = document.getElementById("mobilePanel");
  if (toggle && panel) {
    var links = Array.prototype.slice.call(panel.querySelectorAll("a"));
    var pageContent = document.querySelectorAll(".skip-link, main, .site-footer, .site-header .brand, .site-header .nav-cta > .btn");

    function setMenuOpen(isOpen) {
      panel.classList.toggle("is-open", isOpen);
      toggle.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
      panel.setAttribute("aria-hidden", isOpen ? "false" : "true");
      if (header) header.classList.toggle("menu-open", isOpen);
      pageContent.forEach(function (element) { element.inert = isOpen; });
      document.body.style.overflow = isOpen ? "hidden" : "";
      if (isOpen && links[0]) links[0].focus();
    }

    toggle.addEventListener("click", function () {
      setMenuOpen(!panel.classList.contains("is-open"));
    });

    panel.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        setMenuOpen(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (!panel.classList.contains("is-open")) return;
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        toggle.focus();
        return;
      }
      if (event.key !== "Tab" || !links.length) return;
      var first = links[0];
      var last = links[links.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        toggle.focus();
      } else if (event.shiftKey && document.activeElement === toggle) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        toggle.focus();
      } else if (!event.shiftKey && document.activeElement === toggle) {
        event.preventDefault();
        first.focus();
      }
    });
  }

})();
