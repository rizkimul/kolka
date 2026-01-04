import { useCallback } from 'react';

export const useTTS = () => {
  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID'; // Indonesian
    utterance.rate = 0.9; // Slightly slower for kids
    utterance.pitch = 1.1; // Slightly higher/friendlier

    window.speechSynthesis.speak(utterance);
  }, []);

  return { speak };
};
