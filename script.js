const trackA = document.getElementById("trackA");
const trackB = document.getElementById("trackB");

const playA = document.getElementById("playA");
const playB = document.getElementById("playB");

const crossfader = document.getElementById("crossfader");
const filter = document.getElementById("filter");

const waveform = document.getElementById("waveform");

/* AUDIO */
const AudioCtx = window.AudioContext || window.webkitAudioContext;
const ctx = new AudioCtx();

const sourceA = ctx.createMediaElementSource(trackA);
const sourceB = ctx.createMediaElementSource(trackB);

/* MIXER */
const masterGain = ctx.createGain();

/* FILTER */
const masterFilter = ctx.createBiquadFilter();
masterFilter.type = "lowpass";

/* FULL QUALITY BY DEFAULT */
masterFilter.frequency.value = 22000;

/* ANALYSER */
const analyser = ctx.createAnalyser();
analyser.fftSize = 128;

sourceA.connect(masterGain);
sourceB.connect(masterGain);

masterGain.connect(masterFilter);
masterFilter.connect(analyser);
analyser.connect(ctx.destination);

/* MOBILE AUDIO */
document.addEventListener(
    "click",
    () => {
        ctx.resume();
    },
    { once: true }
);

/* TRACK BUTTONS RESTART SONG */
playA.onclick = () => {
    trackA.currentTime = 0;
    trackA.play();
};

playB.onclick = () => {
    trackB.currentTime = 0;
    trackB.play();
};

/* CROSSFADER */
crossfader.oninput = () => {
    const v = crossfader.value / 100;

    trackA.volume = 1 - v;
    trackB.volume = v;
};

/* FILTER */
filter.oninput = () => {
    const v = filter.value / 100;

    const frequency = 22000 - (v * 21000);

    masterFilter.frequency.value = frequency;
};

/* EQ BARS */
const bars = [];

for (let i = 0; i < 40; i++) {
    const bar = document.createElement("div");
    bar.className = "bar";
    waveform.appendChild(bar);
    bars.push(bar);
}

function animate() {
    requestAnimationFrame(animate);

    const data = new Uint8Array(analyser.frequencyBinCount);

    analyser.getByteFrequencyData(data);

    bars.forEach((bar, i) => {
        const value = data[i] || 0;
        bar.style.height = Math.max(8, value / 2) + "px";
    });
}

animate();
