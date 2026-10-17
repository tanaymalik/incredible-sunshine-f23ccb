(function () {
  "use strict";

  var STORAGE_KEY = "vedtaara-cookie-preferences-v1";
  var GOOGLE_ID = "G-MTQVC4TC3W";
  var META_ID = "961168657044900";
  var analyticsLoaded = false;
  var marketingLoaded = false;

  function readPreferences() {
    try {
      var value = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
      if (value && typeof value.analytics === "boolean" && typeof value.marketing === "boolean") return value;
    } catch (error) { /* Storage may be unavailable; keep optional tags off. */ }
    return null;
  }

  function savePreferences(value) {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value)); } catch (error) { /* Keep this session's choice. */ }
    applyPreferences(value);
    renderBanner(false);
  }

  function loadAnalytics() {
    if (analyticsLoaded) return;
    analyticsLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GOOGLE_ID);
    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + GOOGLE_ID;
    document.head.appendChild(script);
  }

  function loadMarketing() {
    if (marketingLoaded) return;
    marketingLoaded = true;
    (function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", META_ID);
    window.fbq("track", "PageView");
  }

  function applyPreferences(value) {
    if (value.analytics) loadAnalytics();
    if (value.marketing) loadMarketing();
    if (!value.analytics && analyticsLoaded && window.gtag) {
      window.gtag("consent", "update", { analytics_storage: "denied" });
    }
    if (!value.marketing && marketingLoaded && window.fbq) window.fbq("consent", "revoke");
  }

  function button(label, className, handler) {
    var control = document.createElement("button");
    control.type = "button";
    control.className = className;
    control.textContent = label;
    control.addEventListener("click", handler);
    return control;
  }

  function renderBanner(show) {
    var banner = document.getElementById("cookieBanner");
    if (!show) {
      if (banner) banner.remove();
      return;
    }
    if (banner) return;

    banner = document.createElement("section");
    banner.id = "cookieBanner";
    banner.className = "cookie-banner";
    banner.setAttribute("aria-label", "Cookie preferences");
    banner.setAttribute("aria-describedby", "cookieBannerCopy");

    var content = document.createElement("div");
    content.className = "cookie-banner-content";
    var title = document.createElement("h2");
    title.textContent = "Your privacy choices";
    var copy = document.createElement("p");
    copy.id = "cookieBannerCopy";
    copy.textContent = "Vedtaara uses optional analytics and advertising tools from Google and Meta to understand visits and measure campaigns. Choose whether to allow them. You can change your choice at any time from Cookie preferences.";
    content.append(title, copy);

    var actions = document.createElement("div");
    actions.className = "cookie-banner-actions";
    actions.append(
      button("Accept optional", "btn btn-primary", function () { savePreferences({ analytics: true, marketing: true }); }),
      button("Reject optional", "btn btn-ghost", function () { savePreferences({ analytics: false, marketing: false }); }),
      button("Choose settings", "cookie-settings-link", showSettings)
    );
    banner.append(content, actions);
    document.body.appendChild(banner);
  }

  function showSettings() {
    var banner = document.getElementById("cookieBanner");
    if (!banner) return;
    banner.replaceChildren();
    var heading = document.createElement("h2");
    heading.textContent = "Cookie preferences";
    var copy = document.createElement("p");
    copy.id = "cookieBannerCopy";
    copy.textContent = "Essential storage keeps your choice. Optional categories are off unless you turn them on.";
    var current = readPreferences() || { analytics: false, marketing: false };
    var form = document.createElement("div");
    form.className = "cookie-preference-options";
    var analytics = makeCheckbox("Allow analytics", "Measure site visits with Google Analytics.", current.analytics);
    var marketing = makeCheckbox("Allow advertising measurement", "Measure advertising with the Meta Pixel.", current.marketing);
    form.append(analytics.wrapper, marketing.wrapper);
    var actions = document.createElement("div");
    actions.className = "cookie-banner-actions";
    actions.append(
      button("Save choices", "btn btn-primary", function () { savePreferences({ analytics: analytics.input.checked, marketing: marketing.input.checked }); }),
      button("Reject optional", "btn btn-ghost", function () { savePreferences({ analytics: false, marketing: false }); })
    );
    banner.append(heading, copy, form, actions);
    heading.tabIndex = -1;
    heading.focus();
  }

  function makeCheckbox(labelText, descriptionText, checked) {
    var wrapper = document.createElement("label");
    wrapper.className = "cookie-preference-option";
    var input = document.createElement("input");
    input.type = "checkbox";
    input.checked = checked;
    var text = document.createElement("span");
    var label = document.createElement("strong");
    label.textContent = labelText;
    var description = document.createElement("small");
    description.textContent = descriptionText;
    text.append(label, description);
    wrapper.append(input, text);
    return { wrapper: wrapper, input: input };
  }

  function addPreferencesLink() {
    var legal = document.querySelector(".footer-legal");
    if (!legal || document.getElementById("cookiePreferencesButton")) return;
    var opener = button("Cookie preferences", "cookie-preferences-button", function () { renderBanner(true); showSettings(); });
    opener.id = "cookiePreferencesButton";
    legal.appendChild(opener);
  }

  var preferences = readPreferences();
  if (preferences) applyPreferences(preferences);
  else renderBanner(true);
  addPreferencesLink();
  window.VedtaaraCookiePreferences = { open: function () { renderBanner(true); showSettings(); } };
})();
