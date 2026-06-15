const trackA = document.getElementById("trackA");
const trackB = document.getElementById("trackB");

const playA = document.getElementById("playA");
const playB = document.getElementById("playB");

const crossfader = document.getElementById("crossfader");
const filter = document.getElementById("filter");

const waveform = document.getElementById("waveform");

/* 🔊 AUDIO ENGINE */
const AudioCtx = window.AudioContext || window.webkitAudioContext;
const ctx = new AudioCtx();

/* SOURCES */
const srcA = ctx.createMediaElementSource(trackA);
const srcB = ctx.createMediaElementSource(trackB);

/* ANALYSER (REAL AUDIO DATA) */
const analyser = ctx.createAnalyser();
analyser.fftSize = 128;

const dataArray = new Uint8Array(analyser.frequencyBinCount);

/* FILTER (PRO DJ STYLE BANDPASS) */
const filterNode = ctx.createBiquadFilter();
filterNode.type = "bandpass";
filterNode.frequency.value = 1000;
filterNode.Q.value = 1;

/* SAFE AUDIO ROUTING */
srcA.connect(filterNode);
srcB.connect(filterNode);
filterNode.connect(analyser);
analyser.connect(ctx.destination);

/* UNLOCK AUDIO (MOBILE FIX) */
document.addEventListener("click", () => ctx.resume(), { once:true });

/* ▶ PLAY + RESTART */
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

/* 🎚 FILTER (REAL DJ SWEEP) */
filter.oninput = () => {
  const v = filter.value / 100;

  filterNode.frequency.value = 200 + (v * 9000);
  filterNode.Q.value = 0.7 + (v * 12);
};

/* 🔊 CREATE WAVEFORM BARS */
const bars = [];
for (let i = 0; i < 40; i++) {
  const bar = document.createElement("div");
  bar.className = "bar";
  waveform.appendChild(bar);
  bars.push(bar);
}

/* 🔥 MAIN AUDIO LOOP */
function animate() {
  requestAnimationFrame(animate);

  analyser.getByteFrequencyData(dataArray);

  let total = 0;

  bars.forEach((bar, i) => {
    const value = dataArray[i] || 0;
    bar.style.height = (value / 2) + "px";
    total += value;
  });

  /* 💡 BEAT ENERGY LIGHTING */
  const energy = total / bars.length;

  document.body.style.filter =
    `brightness(${1 + energy / 400})`;
}

animate();
