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

/* 🎛 REAL DJ FILTER (BANDPASS STYLE) */
const filterNode = ctx.createBiquadFilter();
filterNode.type = "bandpass";
filterNode.frequency.value = 1000;
filterNode.Q.value = 1;

srcA.connect(filterNode);
srcB.connect(filterNode);
filterNode.connect(ctx.destination);

/* unlock audio */
document.addEventListener("click", () => ctx.resume(), { once:true });

/* ▶ PLAY + RESTART ON TAP */
playA.onclick = () => {
  trackA.currentTime = 0;
  trackA.play();
};

playB.onclick = () => {
  trackB.currentTime = 0;
  trackB.play();
};

/* 🎚 CROSSFADER */
crossfader.oninput = () => {
  const v = crossfader.value / 100;
  trackA.volume = 1 - v;
  trackB.volume = v;
};

/* 🎚 REAL DJ FILTER (NOT BASSY ANYMORE) */
filter.oninput = () => {
  const v = filter.value / 100;

  // Sweep from low frequency → high frequency
  // gives real "radio / club sweep" feel
  filterNode.frequency.value = 200 + (v * 6000);
  filterNode.Q.value = 0.5 + (v * 8);
};

/* 🎛 VISUAL EQ */
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
