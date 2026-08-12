/*!
 * Review Widget — floating, cycling testimonial card.
 * Paste this whole <script> block into your site's <head> (or right
 * before </body>, which is friendlier to page-load speed).
 *
 * Edit the REVIEWS array and CONFIG below with your own picks.
 * No outbound links, no external requests, no tracking — everything
 * needed to render the widget lives in this one file.
 */
(function () {
  "use strict";

  // ------------------------------------------------------------------
  // 1. YOUR REVIEWS — add/remove/reorder as many as you like (5-10 is a
  //    good range). "avatar" is optional: leave it out and the widget
  //    will show a colored circle with the reviewer's first initial.
  // ------------------------------------------------------------------
  var REVIEWS = [

{
      name: "Rayne Phillips",
      text: "TLDR: BOOK HER!!!!!!! Choosing Hannah and Corey was the BEST wedding decision we made. Our photos are simply incredible, but you can see that for yourself! They captured the joy, the emotion, the tiny moments we didn't even realize were happening, and the feeling of the entire weekend in a way that I don't think anyone else could have. We hired the best photographers on the planet, but more importantly, we gained friends.",
      rating: 5,
      avatar: 'https://cdn.jsdelivr.net/gh/fimrah/r-widget-2026@main/RPJ.jpg'
    },

    {
      name: "Kat Fleckenstein",
      text: "I cannot recommend Hannah and her team highly enough. She is organized, responsive, and deeply attentive to every detail, but it is her presence that truly sets her apart. On the day itself, she was indispensable. Hannah has a rare gift for knowing exactly how to make you feel comfortable and at ease...",
      rating: 5,
      avatar: null // e.g. "https://yoursite.com/images/jennifer.jpg"
    },

    {
      name: "Ashley Kim",
      text: "Hannah is a true professional with great energy! I'm impressed by the quality, variety, and intentionality of our wedding photos. Our guests were impressed too, and some even asked for her details for their future events...",
      rating: 5,
      avatar: null
    },
    {
      name: "Hannah Beard",
      text: "I truly can't recommend Hannah enough!! She approached our day with such intentionality, capturing every moment filled with love and authenticity. Forever will cherish these photos and the memories she helped keep!",
      rating: 5,
      avatar: 'https://cdn.jsdelivr.net/gh/fimrah/r-widget-2026@main/hannahgbrenner.jpg'
    },
    {
      name: "Kayla Callaway",
      text: "Hannah has a keen eye for capturing beautiful, organic photos during some of the most important moments of your life. We worked with her for our engagement session and wedding and she took excellent care of us, striking a balance to be both encouraging and also creating a space for my husband and I to stay authentic to who we are as a couple.",
      rating: 5,
      avatar: null
    }
  ];
  

  // ------------------------------------------------------------------
  // 2. SETTINGS
  // ------------------------------------------------------------------
  var CONFIG = {
    position: "bottom-left", // "bottom-left" | "bottom-right"
    firstDelayMs: 3000, // wait before the first card appears
    visibleMs: 4000, // how long each card stays on screen
    gapMs: 4000, // pause between one card leaving and the next arriving
    shuffle: false, // randomize order instead of using list order
    hideOnMobile: false, // set true to hide under 480px wide
    dismissRemembersFor: "session" // "session" | "always" | "none"
  };

  // ------------------------------------------------------------------
  // Implementation — no need to edit below this line.
  // ------------------------------------------------------------------
  if (window.__reviewWidgetLoaded) return;
  window.__reviewWidgetLoaded = true;

  var STORAGE_KEY = "reviewWidgetDismissed";
  try {
    if (CONFIG.dismissRemembersFor === "always" && localStorage.getItem(STORAGE_KEY)) return;
    if (CONFIG.dismissRemembersFor === "session" && sessionStorage.getItem(STORAGE_KEY)) return;
  } catch (e) {}

  var AVATAR_COLORS = ["#E2622B", "#2B6CE2", "#2BA84A", "#9B2BE2", "#E2B02B", "#2BC4C4"];

  function colorForName(name) {
    var hash = 0;
    for (var i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
  }

  function initials(name) {
    return (name.trim().charAt(0) || "?").toUpperCase();
  }

  function starSVG() {
    return '<svg viewBox="0 0 20 20" width="14" height="14" fill="#FBBC04" aria-hidden="true"><path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.2 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.2 6.1-.6z"/></svg>';
  }

  function googleGSVG() {
    return (
      '<svg viewBox="0 0 48 48" width="16" height="16" aria-hidden="true">' +
      '<path fill="#EA4335" d="M24 9.5c3.4 0 6.4 1.2 8.8 3.4l6.5-6.5C35.3 2.7 30 0.5 24 0.5 14.6 0.5 6.5 5.9 2.6 13.8l7.6 5.9C12.1 13.5 17.6 9.5 24 9.5z"/>' +
      '<path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.6c-.5 3-2.2 5.5-4.7 7.2l7.3 5.7c4.3-4 6.8-9.8 6.8-17.4z"/>' +
      '<path fill="#FBBC05" d="M10.2 19.7C9.6 21.4 9.3 23.2 9.3 25s.3 3.6.9 5.3l-7.6 5.9C1 32.5 0 28.9 0 25s1-7.5 2.6-11.2z"/>' +
      '<path fill="#34A853" d="M24 49c6.5 0 11.9-2.1 15.9-5.8l-7.3-5.7c-2 1.4-4.7 2.3-8.6 2.3-6.4 0-11.9-4-13.8-9.7l-7.6 5.9C6.5 43.6 14.6 49 24 49z"/>' +
      "</svg>"
    );
  }

  var css =
    "#rvw-widget{box-sizing:border-box;position:fixed;z-index:2147483000;width:320px;max-width:calc(100vw - 32px);" +
    "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;" +
    "background:#fff;border-radius:14px;box-shadow:0 6px 24px rgba(0,0,0,.16);padding:16px 18px;" +
    "opacity:0;transform:translateY(16px);transition:opacity .35s ease,transform .35s ease;pointer-events:none;}" +
    "#rvw-widget *{box-sizing:border-box;}" +
    "#rvw-widget.rvw-bottom-left{left:16px;bottom:calc(16px + env(safe-area-inset-bottom, 0px));}" +
    "#rvw-widget.rvw-bottom-right{right:16px;bottom:calc(16px + env(safe-area-inset-bottom, 0px));}" +
    "#rvw-widget.rvw-visible{opacity:1;transform:translateY(0);pointer-events:auto;}" +
    "#rvw-widget .rvw-close{position:absolute;top:4px;right:4px;width:36px;height:36px;border:none;" +
    "background:none;cursor:pointer;display:flex;align-items:center;justify-content:center;" +
    "font-size:18px;line-height:1;color:#9aa0a6;}" +
    "#rvw-widget .rvw-close:hover{color:#5f6368;}" +
    "#rvw-widget .rvw-row{display:flex;gap:12px;align-items:flex-start;padding-right:22px;}" +
    "#rvw-widget .rvw-avatar{flex:0 0 auto;width:46px;height:46px;border-radius:50%;display:flex;" +
    "align-items:center;justify-content:center;color:#fff;font-weight:600;font-size:18px;overflow:hidden;}" +
    "#rvw-widget .rvw-avatar img{width:100%;height:100%;object-fit:cover;}" +
    "#rvw-widget .rvw-body{min-width:0;}" +
    "#rvw-widget .rvw-name{font-weight:700;font-size:14.5px;color:#1a1a1a;margin:0 0 4px;}" +
    "#rvw-widget .rvw-text{font-style:italic;font-size:13.5px;line-height:1.4;color:#3c3c3c;margin:0 0 8px;}" +
    "#rvw-widget .rvw-meta{display:flex;align-items:center;gap:6px;}" +
    "#rvw-widget .rvw-stars{display:inline-flex;gap:1px;}" +
    "@media (max-width:480px){#rvw-widget.rvw-hide-mobile{display:none!important;}}";

  var styleTag = document.createElement("style");
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  function buildWidget() {
    var el = document.createElement("div");
    el.id = "rvw-widget";
    el.className = "rvw-" + CONFIG.position + (CONFIG.hideOnMobile ? " rvw-hide-mobile" : "");
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    el.innerHTML =
      '<button class="rvw-close" aria-label="Dismiss">&times;</button>' +
      '<div class="rvw-row">' +
      '<div class="rvw-avatar" id="rvw-avatar"></div>' +
      '<div class="rvw-body">' +
      '<p class="rvw-name" id="rvw-name"></p>' +
      '<p class="rvw-text" id="rvw-text"></p>' +
      '<div class="rvw-meta">' +
      '<span id="rvw-google">' + googleGSVG() + '</span>' +
      '<span class="rvw-stars" id="rvw-stars"></span>' +
      "</div></div></div>";
    document.body.appendChild(el);

    el.querySelector(".rvw-close").addEventListener("click", function () {
      el.classList.remove("rvw-visible");
      stopped = true;
      clearTimeout(timer);
      try {
        if (CONFIG.dismissRemembersFor === "always") localStorage.setItem(STORAGE_KEY, "1");
        if (CONFIG.dismissRemembersFor === "session") sessionStorage.setItem(STORAGE_KEY, "1");
      } catch (e) {}
    });

    return el;
  }

  function fillCard(el, review) {
    var avatarEl = el.querySelector("#rvw-avatar");
    if (review.avatar) {
      avatarEl.style.background = "transparent";
      avatarEl.innerHTML = '<img src="' + review.avatar + '" alt="">';
      avatarEl.querySelector("img").addEventListener("error", function () {
        avatarEl.style.background = colorForName(review.name);
        avatarEl.innerHTML = initials(review.name);
      });
    } else {
      avatarEl.style.background = colorForName(review.name);
      avatarEl.innerHTML = initials(review.name);
    }
    el.querySelector("#rvw-google").style.display = review.showGoogle === false ? "none" : "";
    el.querySelector("#rvw-name").textContent = review.name;
    el.querySelector("#rvw-text").textContent = '"' + review.text + '"';
    var stars = "";
    for (var i = 0; i < (review.rating || 5); i++) stars += starSVG();
    el.querySelector("#rvw-stars").innerHTML = stars;
  }

  var order = REVIEWS.slice();
  if (CONFIG.shuffle) {
    for (var i = order.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = order[i];
      order[i] = order[j];
      order[j] = tmp;
    }
  }

  var idx = 0;
  var stopped = false;
  var timer = null;
  var widgetEl = null;

  function cycle() {
    if (stopped || !order.length) return;
    if (!widgetEl) widgetEl = buildWidget();

    fillCard(widgetEl, order[idx % order.length]);
    idx++;

    requestAnimationFrame(function () {
      widgetEl.classList.add("rvw-visible");
    });

    timer = setTimeout(function () {
      widgetEl.classList.remove("rvw-visible");
      timer = setTimeout(cycle, CONFIG.gapMs);
    }, CONFIG.visibleMs);
  }

  function start() {
    timer = setTimeout(cycle, CONFIG.firstDelayMs);
  }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    start();
  } else {
    document.addEventListener("DOMContentLoaded", start);
  }
})();
