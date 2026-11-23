/* Home page instrument: a live model of the high voltage indicator circuit. */
(function () {
  "use strict";
  var svg = document.getElementById("scope");
  if (!svg) return;
  var M = window.HVModel;
  var slider = document.getElementById("vin"), out = document.getElementById("vinOut"), led = document.getElementById("led");
  var W = 320, H = 168, l = 34, r = 10, t = 10, b = 30, pw = W - l - r, ph = H - t - b;
  function X(v) { return l + (v - 280) / 190 * pw; }
  function Y(v) { return t + ph - v / 14 * ph; }
  var s = "";
  [0, 4, 8, 12].forEach(function (v) {
    s += '<path class="g" d="M' + l + " " + Y(v) + "H" + (W - r) + '"/><text class="t" x="' + (l - 5) + '" y="' + (Y(v) + 3) + '" text-anchor="end">' + v + "</text>";
  });
  [300, 350, 400, 450].forEach(function (v) {
    s += '<path class="g" d="M' + X(v) + " " + t + "V" + (t + ph) + '"/><text class="t" x="' + X(v) + '" y="' + (t + ph + 13) + '" text-anchor="middle">' + v + "</text>";
  });
  s += '<text class="t" x="' + (l + pw / 2) + '" y="' + (H - 4) + '" text-anchor="middle">accumulator voltage (V)</text>';
  s += '<text class="t" transform="translate(8 ' + (t + ph / 2) + ') rotate(-90)" text-anchor="middle">node (V)</text>';
  s += '<path class="kn" d="M' + X(M.knee) + " " + t + "V" + (t + ph) + '"/><text class="kt" x="' + (X(M.knee) - 4) + '" y="' + (t + 18) + '" text-anchor="end">zener clamps ' + Math.round(M.knee) + " V</text>";
  var d = "";
  for (var v = 280; v <= 470; v += 2) d += (v === 280 ? "M" : "L") + X(v).toFixed(1) + " " + Y(M.at(v).vn).toFixed(1);
  s += '<path class="tr" d="' + d + '"/><path class="cur" id="cur" d="M0 0"/><circle class="dot" id="dot" r="5" cx="0" cy="0"/>';
  svg.innerHTML = s;
  var cur = document.getElementById("cur"), dot = document.getElementById("dot"), ref = M.at(470).il;

  function set(volts) {
    var m = M.at(volts);
    out.textContent = Math.round(volts) + " V";
    cur.setAttribute("d", "M" + X(volts) + " " + t + "V" + (t + ph));
    dot.setAttribute("cx", X(volts)); dot.setAttribute("cy", Y(m.vn));
    led.style.setProperty("--b", (m.il / ref).toFixed(3));
    document.getElementById("rNode").textContent = m.vn.toFixed(2) + " V";
    document.getElementById("rLed").textContent = (m.il * 1000).toFixed(1) + " mA";
    document.getElementById("rStr").textContent = (m.is * 1000).toFixed(1) + " mA";
    document.getElementById("rZen").textContent = (m.iz * 1000).toFixed(1) + " mA";
    document.getElementById("rPow").textContent = m.pr.toFixed(2) + " W";
  }
  var touched = false;
  slider.addEventListener("input", function () { touched = true; set(+slider.value); });
  set(470);
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduced) {
    setTimeout(function () {
      var t0 = null;
      function frame(ts) {
        if (touched) return;
        if (t0 === null) t0 = ts;
        var p = Math.min(1, (ts - t0) / 3400);
        var e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        var volts = 280 + 190 * e;
        slider.value = volts; set(volts);
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }, 700);
  }
})();
