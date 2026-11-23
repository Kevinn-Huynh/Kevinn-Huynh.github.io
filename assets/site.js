/* Shared behaviour: header and footer, theme toggle, project cards, image lightbox and charts. */
(function () {
  "use strict";
  var S = window.SITE || {};
  var P = window.PROJECTS || [];

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function slugify(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }

  /* ---------- theme ---------- */
  var KEY = "kh-theme";
  function effectiveTheme() {
    var t = document.documentElement.getAttribute("data-theme");
    if (t) return t;
    return (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
  }
  function toggleTheme() {
    var next = effectiveTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem(KEY, next); } catch (e) { /* storage can be blocked */ }
  }

  /* ---------- header and footer ---------- */
  function buildChrome() {
    var active = document.body.getAttribute("data-page");
    var links = [["index.html", "Home", "home"], ["projects.html", "Projects", "projects"], ["about.html", "About", "about"], ["contact.html", "Contact", "contact"]];
    var header = el("header", "wrap top");
    var brand = el("a", "brand", S.name || "Portfolio"); brand.href = "index.html";
    header.appendChild(brand);
    var nav = el("nav"); nav.setAttribute("aria-label", "Main");
    links.forEach(function (l) {
      var a = el("a", null, l[1]); a.href = l[0];
      if (l[2] === active) a.setAttribute("aria-current", "page");
      nav.appendChild(a);
    });
    var tb = el("button", "theme-btn", "Theme"); tb.type = "button";
    tb.setAttribute("aria-label", "Switch between light and dark theme");
    tb.addEventListener("click", toggleTheme);
    nav.appendChild(tb);
    header.appendChild(nav);
    document.body.insertBefore(header, document.body.firstChild);

    var footer = el("footer");
    var wrap = el("div", "wrap");
    wrap.appendChild(el("span", "mono", (S.name || "") + " · " + (S.location || "")));
    var l2 = el("div", "links2");
    var em = el("a", "mono", S.email || ""); em.href = "mailto:" + (S.email || "");
    var li = el("a", "mono", "LinkedIn"); li.href = S.linkedin || "#"; li.target = "_blank"; li.rel = "noopener";
    l2.appendChild(em); l2.appendChild(li);
    wrap.appendChild(l2); footer.appendChild(wrap);
    document.body.appendChild(footer);
  }

  /* ---------- lightbox ---------- */
  var lb, lbImg, lbCap;
  function buildLightbox() {
    lb = el("div"); lb.id = "lb"; lb.hidden = true;
    lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true"); lb.setAttribute("aria-label", "Enlarged image");
    var close = el("button", null, "Close"); close.type = "button";
    lbImg = el("img"); lbCap = el("p");
    lb.appendChild(close); lb.appendChild(lbImg); lb.appendChild(lbCap);
    document.body.appendChild(lb);
    lb.addEventListener("click", function (e) { if (e.target !== lbImg) closeLightbox(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !lb.hidden) closeLightbox(); });
  }
  function openLightbox(item) {
    lbImg.src = item.src; lbImg.alt = item.alt || ""; lbCap.textContent = item.caption || "";
    lb.hidden = false; lb.querySelector("button").focus();
  }
  function closeLightbox() { lb.hidden = true; }

  /* ---------- decorative circuit-trace art for cards without a cover ---------- */
  function hashStr(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { var a = seed; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function traceArt(seed) {
    var r = rng(hashStr(seed)), W = 320, H = 200, g = 20, svg = '<svg viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="xMidYMid slice" aria-hidden="true">';
    for (var i = 0; i < 7; i++) {
      var x = Math.floor(r() * 4) * g, y = (1 + Math.floor(r() * 8)) * g, d = "M" + x + " " + y, steps = 4 + Math.floor(r() * 4);
      for (var s = 0; s < steps; s++) {
        var run = (1 + Math.floor(r() * 3)) * g;
        x += run; d += "H" + x;
        var dy = (r() < 0.5 ? -1 : 1) * (1 + Math.floor(r() * 2)) * g;
        if (y + dy < g || y + dy > H - g) dy = -dy;
        x += Math.abs(dy); y += dy; d += "L" + x + " " + y;
        if (x > W + 40) break;
      }
      var op = (0.35 + r() * 0.6).toFixed(2);
      svg += '<path d="' + d + '" fill="none" stroke="var(--trace)" stroke-width="2" stroke-linejoin="round" stroke-opacity="' + op + '"/>';
      svg += '<circle cx="' + Math.min(x, W - 6) + '" cy="' + y + '" r="4.5" fill="var(--panel)" stroke="var(--trace)" stroke-width="2" stroke-opacity="' + op + '"/>';
    }
    return svg + "</svg>";
  }

  /* ---------- project cards ---------- */
  function projectCard(p) {
    var a = el("a", "card"); a.href = "project.html#" + p.slug;
    var media = el("div", "card-media");
    if (p.cover) {
      var img = el("img", p.coverFit === "contain" ? "contain" : ""); img.src = p.cover; img.alt = ""; img.loading = "lazy";
      media.appendChild(img);
    } else { media.innerHTML = traceArt(p.slug); }
    a.appendChild(media);
    var body = el("div", "card-body");
    body.appendChild(el("span", "mono", p.date));
    body.appendChild(el("h3", null, p.title));
    if (p.summary) body.appendChild(el("p", null, p.summary));
    if (p.tags && p.tags.length) {
      var ul = el("ul", "tags");
      p.tags.slice(0, 4).forEach(function (t) { ul.appendChild(el("li", null, t)); });
      body.appendChild(ul);
    }
    body.appendChild(el("span", "card-more", "View project →"));
    a.appendChild(body);
    return a;
  }

  /* ---------- media ---------- */
  function imageFigure(item) {
    var fig = el("figure", item.wide ? "wide" : "");
    var btn = el("button", "zoom"); btn.type = "button";
    btn.setAttribute("aria-label", "Enlarge image: " + (item.caption || item.alt || "image"));
    var img = el("img"); img.src = item.src; img.alt = item.alt || ""; img.loading = "lazy";
    btn.appendChild(img);
    btn.addEventListener("click", function () { openLightbox(item); });
    fig.appendChild(btn);
    if (item.caption) fig.appendChild(el("figcaption", null, item.caption));
    return fig;
  }

  function niceStep(range, n) {
    var raw = range / n, p = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10)), f = raw / p;
    return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p;
  }
  function ticksFor(min, max, n) {
    var s = niceStep(max - min, n), out = [];
    for (var v = Math.ceil(min / s - 1e-9) * s; v <= max + 1e-9; v += s) out.push(+v.toFixed(10));
    return out;
  }
  function fmt(v) { return (Math.abs(v) >= 100 || v === Math.round(v)) ? String(Math.round(v * 100) / 100) : v.toFixed(1); }

  function chartFigure(spec) {
    var W = 420, H = 280, m = { l: 48, r: 14, t: 12, b: 46 };
    var pw = W - m.l - m.r, ph = H - m.t - m.b, xs = spec.x;
    var xMin = Math.min.apply(null, xs), xMax = Math.max.apply(null, xs), lo = Infinity, hi = -Infinity;
    spec.series.forEach(function (s) { s.y.forEach(function (v) { lo = Math.min(lo, v); hi = Math.max(hi, v); }); });
    if (lo > 0) lo = 0;
    var step = niceStep(hi - lo || 1, 5);
    var yMin = spec.yMin != null ? spec.yMin : Math.floor(lo / step) * step;
    var yMax = spec.yMax != null ? spec.yMax : Math.ceil(hi / step) * step;
    function X(v) { return m.l + (v - xMin) / (xMax - xMin || 1) * pw; }
    function Y(v) { return m.t + ph - (v - yMin) / (yMax - yMin || 1) * ph; }
    var cols = ["var(--s1)", "var(--s2)", "var(--s3)"];

    var fig = el("figure", "chart");
    fig.appendChild(el("h4", null, spec.title));
    if (spec.series.length > 1) {
      var lg = el("div", "legend");
      spec.series.forEach(function (s, i) {
        var item = el("span", null, s.name), sw = el("i"); sw.style.background = cols[i % 3];
        item.insertBefore(sw, item.firstChild); lg.appendChild(item);
      });
      fig.appendChild(lg);
    }
    var plot = el("div", "plot");
    var svg = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + String(spec.title).replace(/"/g, "") + '">';
    ticksFor(yMin, yMax, 5).forEach(function (t) {
      svg += '<path class="gl" d="M' + m.l + " " + Y(t) + "H" + (W - m.r) + '"/><text class="tk" x="' + (m.l - 6) + '" y="' + (Y(t) + 4) + '" text-anchor="end">' + fmt(t) + "</text>";
    });
    ticksFor(xMin, xMax, 5).forEach(function (t) {
      svg += '<text class="tk" x="' + X(t) + '" y="' + (m.t + ph + 16) + '" text-anchor="middle">' + fmt(t) + "</text>";
    });
    svg += '<path class="ax" d="M' + m.l + " " + (m.t + ph) + "H" + (W - m.r) + '"/>';
    svg += '<text class="tk" x="' + (m.l + pw / 2) + '" y="' + (H - 6) + '" text-anchor="middle">' + (spec.xLabel || "") + "</text>";
    svg += '<text class="tk" transform="translate(11 ' + (m.t + ph / 2) + ') rotate(-90)" text-anchor="middle">' + (spec.yLabel || "") + "</text>";
    spec.series.forEach(function (s, i) {
      var d = s.y.map(function (v, k) { return (k ? "L" : "M") + X(xs[k]).toFixed(1) + " " + Y(v).toFixed(1); }).join("");
      if (spec.series.length === 1) svg += '<path d="' + d + "L" + X(xMax) + " " + Y(yMin) + "L" + X(xMin) + " " + Y(yMin) + 'Z" fill="' + cols[0] + '" fill-opacity="0.12" stroke="none"/>';
      svg += '<path class="ln" d="' + d + '" stroke="' + cols[i % 3] + '"/>';
    });
    svg += '<path class="hv" d="M0 0" style="display:none"/>';
    spec.series.forEach(function (s, i) { svg += '<circle class="pt" r="4" fill="' + cols[i % 3] + '" stroke="var(--surface)" stroke-width="2" cx="-10" cy="-10"/>'; });
    svg += '<rect x="' + m.l + '" y="' + m.t + '" width="' + pw + '" height="' + ph + '" fill="transparent" pointer-events="all"/></svg>';
    plot.innerHTML = svg;
    var tip = el("div", "tip"); tip.hidden = true; plot.appendChild(tip);
    fig.appendChild(plot);
    if (spec.note) fig.appendChild(el("figcaption", null, spec.note));

    var hv = plot.querySelector(".hv"), pts = plot.querySelectorAll(".pt"), svgEl = plot.querySelector("svg");
    var unit = ((spec.xLabel || "").match(/\(([^)]+)\)/) || ["", ""])[1];
    function show(ev) {
      var r = svgEl.getBoundingClientRect(), vx = (ev.clientX - r.left) / (r.width || 1) * W, best = 0, bd = Infinity;
      xs.forEach(function (v, k) { var dd = Math.abs(X(v) - vx); if (dd < bd) { bd = dd; best = k; } });
      hv.style.display = ""; hv.setAttribute("d", "M" + X(xs[best]) + " " + m.t + "V" + (m.t + ph));
      var html = fmt(xs[best]) + " " + unit;
      spec.series.forEach(function (s, i) {
        pts[i].setAttribute("cx", X(xs[best])); pts[i].setAttribute("cy", Y(s.y[best]));
        html += "<br>" + s.name + ": " + fmt(s.y[best]);
      });
      tip.innerHTML = html; tip.hidden = false;
      var px = X(xs[best]) / W * r.width;
      tip.style.left = Math.min(Math.max(px, 60), Math.max(r.width - 60, 60)) + "px";
    }
    function hide() {
      hv.style.display = "none"; tip.hidden = true;
      for (var i = 0; i < pts.length; i++) { pts[i].setAttribute("cx", -10); pts[i].setAttribute("cy", -10); }
    }
    plot.addEventListener("pointermove", show);
    plot.addEventListener("pointerdown", show);
    plot.addEventListener("pointerleave", hide);
    return fig;
  }

  function mediaFigure(item) { return item.type === "chart" ? chartFigure(item) : imageFigure(item); }

  buildChrome();
  buildLightbox();
  window.Kit = { el: el, slugify: slugify, projectCard: projectCard, mediaFigure: mediaFigure, projects: P, site: S };
})();
