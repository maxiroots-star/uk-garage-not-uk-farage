const trackA = document.getElementById("trackA");
const trackB = document.getElementById("trackB");

const playA = document.getElementById("playA");
const playB = document.getElementById("playB");
const crossfader = document.getElementById("crossfader");

/* unlock audio */
document.addEventListener("click", () => {
  trackA.volume = 0.5;
  trackB.volume = 0.5;
}, { once:true });

playA.onclick = () => {
  trackA.currentTime = 0;
  trackA.play();
};

playB.onclick = () => {
  trackB.currentTime = 0;
  trackB.play();
};

crossfader.oninput = () => {
  const v = crossfader.value / 100;
  trackA.volume = 1 - v;
  trackB.volume = v;
};
