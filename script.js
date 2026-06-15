const trackA = document.getElementById("trackA");
const trackB = document.getElementById("trackB");

const playA = document.getElementById("playA");
const playB = document.getElementById("playB");

const crossfader = document.getElementById("crossfader");
const filter = document.getElementById("filter");
const eq = document.getElementById("eq");

/* 🔊 AUDIO CONTEXT */
const AudioCtx = window.AudioContext || window.webkitAudioContext;
const ctx = new AudioCtx();

const srcA = ctx.createMediaElementSource(trackA);
const srcB = ctx.createMediaElementSource(trackB);

/* 🎚 FILTER (BASS BOOST SYSTEM) */
const bassFilter = ctx.createBiquadFilter();
bassFilter.type = "lowshelf";
bassFilter.frequency.value = 400;

srcA.connect(bassFilter);
srcB.connect(bassFilter);
bassFilter.connect(ctx.destination);

/* unlock audio */
document.addEventListener("click", () => ctx.resume(), { once:true });

/* PLAY */
playA.onclick = () => trackA.play();
playB.onclick = () => trackB.play();

/* CROSSFADER */
crossfader.oninput = () => {
  const v = crossfader.value / 100;
  trackA.volume = 1 - v;
  trackB.volume = v;
};

/* 🎚 FILTER = STRONG BASS BOOST */
filter.oninput = () => {
  const v = filter.value / 100;

  // -20 to +20 gain
  bassFilter.gain.value = (v - 0.5) * 40;
};

/* 🎛 VISUAL EQ (COLOUR BARS) */
for (let i = 0; i < 25; i++) {
  const bar = document.createElement("div");
  bar.className = "bar";
  eq.appendChild(bar);
}

setInterval(() => {
  document.querySelectorAll(".bar").forEach(bar => {
    bar.style.height = (Math.random() * 80 + 5) + "px";
    bar.style.opacity = 0.4 + Math.random() * 0.6;
  });
}, 120);
