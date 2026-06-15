const trackA = document.getElementById("trackA");
const trackB = document.getElementById("trackB");

const playA = document.getElementById("playA");
const playB = document.getElementById("playB");

const crossfader = document.getElementById("crossfader");
const filterToggle = document.getElementById("filterToggle");

const waveform = document.getElementById("waveform");

/* 🔊 AUDIO ENGINE */
const AudioCtx = window.AudioContext || window.webkitAudioContext;
const ctx = new AudioCtx();

const srcA = ctx.createMediaElementSource(trackA);
const srcB = ctx.createMediaElementSource(trackB);

/* ANALYSER */
const analyser = ctx.createAnalyser();
analyser.fftSize = 128;

const dataArray = new Uint8Array(analyser.frequencyBinCount);

/* FILTER (OFF BY DEFAULT) */
const filterNode = ctx.createBiquadFilter();
filterNode.type = "bandpass";
filterNode.frequency.value = 1000;
filterNode.Q.value = 1;

/* ROUTING */
srcA.connect(filterNode);
srcB.connect(filterNode);
filterNode.connect(analyser);
analyser.connect(ctx.destination);

/* UNLOCK AUDIO */
document.addEventListener("click", () => ctx.resume(), { once:true });

/* PLAY */
playA.onclick = () => {
  trackA.currentTime = 0;
  trackA.play();
};

playB.onclick = () => {
  trackB.currentTime = 0;
  trackB.play();
};

/* CROSSFADE */
crossfader.oninput = () => {
  const v = crossfader.value / 100;
  trackA.volume = 1 - v;
  trackB.volume = v;
};

/* 🎚 FILTER TOGGLE (FIXED) */
let filterOn = false;

filterToggle.onclick = () => {
  filterOn = !filterOn;

  if (filterOn) {
    filterToggle.innerText = "FILTER: ON";
    filterNode.frequency.value = 3000; // active DJ effect
  } else {
    filterToggle.innerText = "FILTER: OFF";
    filterNode.frequency.value = 20000; // basically clean sound
  }
};

/* 🔊 FIXED WAVEFORM */
const bars = [];
for (let i = 0; i < 40; i++) {
  const bar = document.createElement("div");
  bar.className = "bar";
  waveform.appendChild(bar);
  bars.push(bar);
}

function animate() {
  requestAnimationFrame(animate);

  analyser.getByteFrequencyData(dataArray);

  bars.forEach((bar, i) => {
    const value = dataArray[i] || 0;
    bar.style.height = (value / 2) + "px";
  });
}

animate();
