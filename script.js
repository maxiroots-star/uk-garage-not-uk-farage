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

/* 🎚 BASS CUT FILTER (IMPORTANT CHANGE) */
const bassFilter = ctx.createBiquadFilter();
bassFilter.type = "highpass";
bassFilter.frequency.value = 20;

srcA.connect(bassFilter);
srcB.connect(bassFilter);
bassFilter.connect(ctx.destination);

/* unlock audio */
document.addEventListener("click", () => ctx.resume(), { once:true });

/* PLAY */
playA.onclick = () => trackA.play();
playB.onclick = () => trackB.play();

/* 🎚 CROSSFADER */
crossfader.oninput = () => {
  const v = crossfader.value / 100;
  trackA.volume = 1 - v;
  trackB.volume = v;
};

/* 🎛 FILTER = BASS CUT */
filter.oninput = () => {
  const v = filter.value / 100;

  // 20Hz → 2000Hz (removes bass as you slide)
  bassFilter.frequency.value = 20 + (v * 1980);
};

/* 🎛 COLOURED EQ BARS */
for (let i = 0; i < 25; i++) {
  const bar = document.createElement("div");
  bar.className = "bar";
  eq.appendChild(bar);
}

setInterval(() => {
  document.querySelectorAll(".bar").forEach(bar => {
    bar.style.height = (Math.random() * 80 + 5) + "px";
  });
}, 120);
