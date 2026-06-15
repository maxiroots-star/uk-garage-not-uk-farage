const trackA = document.getElementById("trackA");
const trackB = document.getElementById("trackB");

const playA = document.getElementById("playA");
const playB = document.getElementById("playB");
const crossfader = document.getElementById("crossfader");

/* 🔓 MOBILE AUDIO UNLOCK */
function unlockAudio() {
    trackA.volume = 0.5;
    trackB.volume = 0.5;

    trackA.play().then(() => trackA.pause()).catch(() => {});
    trackB.play().then(() => trackB.pause()).catch(() => {});
}

document.addEventListener("click", unlockAudio, { once: true });
document.addEventListener("touchstart", unlockAudio, { once: true });

/* ▶ PLAY TRACKS */
playA.addEventListener("click", () => {
    trackA.currentTime = 0;
    trackA.play();
});

playB.addEventListener("click", () => {
    trackB.currentTime = 0;
    trackB.play();
});

/* 🎚 CROSSFADER */
crossfader.addEventListener("input", () => {
    const v = crossfader.value / 100;

    trackA.volume = 1 - v;
    trackB.volume = v;
});
