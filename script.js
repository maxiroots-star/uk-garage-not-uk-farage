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

/* SOURCES */
const srcA = ctx.createMediaElementSource(trackA);
const srcB = ctx.createMediaElementSource(trackB);

/* MASTER ANALYSER (FOR VISUALS + BEAT FEEL) */
const analyser = ctx.createAnalyser();
analyser.fftSize = 64;

const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

/* FILTER (REAL DJ STYLE BANDPASS) */
const filterNode = ctx.createBiquadFilter();
filterNode.type = "bandpass";
filterNode.frequency.value = 1000;
filterNode.Q.value = 1;

/* AUDIO ROUTING */
srcA.connect(filterNode);
srcB.connect(filterNode);
filterNode.connect(analyser);
analyser.connect(ctx.destination);

/* unlock audio */
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

/* 🎚 FILTER (SMOOTH DJ SWEEP) */
filter.oninput = () => {
  const v = filter.value / 100;

  filterNode.frequency.value = 200 + (v * 8000);
  filterNode.Q.value = 0.5 + (v * 10);
};

/* 🎛 REAL AUDIO VISUALISER */
for (let i = 0; i < bufferLength; i++) {
  const bar = document.createElement("div");
  bar.className = "bar";
  eq.appendChild(bar);
}

/* 🔊 ANIMATION LOOP */
function animate() {
  requestAnimationFrame(animate);

  analyser.getByteFrequencyData(dataArray);

  const bars = document.querySelectorAll(".bar");

  let sum = 0;

  bars.forEach((bar, i) => {
    const value = dataArray[i] || 0;
    bar.style.height = (value / 2) + "px";
    sum += value;
  });

  /* 💡 BEAT-STYLE LIGHT PULSE */
  const energy = sum / bufferLength;

  document.body.style.filter =
    `brightness(${1 + energy / 300})`;
}

animate();
