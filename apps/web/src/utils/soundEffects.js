// Simple synth-based sound effects to avoid external assets
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const playTone = (freq, type, duration) => {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + duration);
};

export const playSuccessSound = () => {
  // Arpeggio up
  playTone(523.25, 'sine', 0.1); // C5
  setTimeout(() => playTone(659.25, 'sine', 0.1), 100); // E5
  setTimeout(() => playTone(783.99, 'sine', 0.2), 200); // G5
};

export const playErrorSound = () => {
  // Low dissonance
  playTone(150, 'sawtooth', 0.2);
  setTimeout(() => playTone(120, 'sawtooth', 0.2), 100);
};

export const playPopSound = () => {
  playTone(800, 'triangle', 0.05);
};
