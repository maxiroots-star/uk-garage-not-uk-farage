const trackA = document.getElementById("trackA");
const trackB = document.getElementById("trackB");

const playA = document.getElementById("playA");
const playB = document.getElementById("playB");

const crossfader = document.getElementById("crossfader");
const filter = document.getElementById("filter");
const visualiser = document.getElementById("visualiser");

/* 🔊 AUDIO CONTEXT (for FX + visuals) */
const AudioCtx = window.AudioContext || window.webkitAudioContext;
const ctx = new AudioCtx();

const srcA = ctx.createMediaElementSource(trackA);
const srcB = ctx.createMediaElementSource(trackB);

/* FILTER (bass/treble feel) */
const biquad = ctx.createBiquadFilter();
biquad.type = "lowshelf";
biquad.frequency.value = 500;

srcA.connect(biquad);
srcB.connect(biquad);
biquad.connect(ctx.destination);

/* unlock audio */
document.addEventListener("click", () => ctx.resume(), { once:true });

/* PLAY */
playA.onclick = () => trackA.play();
playB.onclick = () => trackB.play();

/* CROSSFADE */
crossfader.oninput = () => {
  const v = crossfader.value / 100;
  trackA.volume = 1 - v;
  trackB.volume = v;
};

/* FILTER KNOB */
filter.oninput = () => {
  biquad.gain.value = (filter.value - 50) * 2;
};

/* 🔊 SIMPLE VISUALISER */
for (let i = 0; i < 30; i++) {
  const bar = document.createElement("div");
  bar.className = "bar";
  visualiser.appendChild(bar);
}

/* animate bars */
setInterval(() => {
  document.querySelectorAll(".bar").forEach(bar => {
    bar.style.height = (Math.random() * 60 + 5) + "px";
  });
}, 100);

/* 💡 BEAT FLASH (simple pulse sync feel) */
setInterval(() => {
  document.body.style.background = "white";
  setTimeout(() => {
    document.body.style.background = "black";
  }, 50);
}, 600);
