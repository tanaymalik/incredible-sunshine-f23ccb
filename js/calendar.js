(function () {
  "use strict";

  var widget = document.querySelector(".calendly-inline-widget");
  var loading = document.getElementById("calendlyLoading");
  if (!widget || !loading) return;

  var started = false;
  var statusText = loading.querySelector("p");
  var spinner = loading.querySelector(".calendar-spinner");

  function showSlowMessage() {
    if (loading.hidden) return;
    if (statusText) statusText.textContent = "Calendly is taking longer than expected. You can open the booking calendar directly below.";
    if (spinner) spinner.hidden = true;
  }

  function watchForCalendarFrame() {
    var frame = widget.querySelector("iframe");
    if (!frame || frame.dataset.vedtaaraLoadObserved) return;
    frame.dataset.vedtaaraLoadObserved = "true";
    frame.addEventListener("load", function () {
      loading.hidden = true;
    }, { once: true });
  }

  var frameObserver = new MutationObserver(watchForCalendarFrame);
  frameObserver.observe(widget, { childList: true, subtree: true });

  function loadCalendar() {
    if (started) return;
    started = true;
    if (statusText) statusText.textContent = "Loading the secure booking calendar…";

    var script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    script.onerror = showSlowMessage;
    script.onload = watchForCalendarFrame;
    document.head.appendChild(script);
    window.setTimeout(showSlowMessage, 18000);
  }

  if ("IntersectionObserver" in window) {
    var trigger = new IntersectionObserver(function (entries) {
      if (entries.some(function (entry) { return entry.isIntersecting; })) {
        trigger.disconnect();
        loadCalendar();
      }
    }, { rootMargin: "900px 0px" });
    trigger.observe(widget);
  } else {
    loadCalendar();
  }
})();
