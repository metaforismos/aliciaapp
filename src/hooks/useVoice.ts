import { useState, useCallback, useEffect, useRef } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';

// ────────────────────────────────────────────
// Spanish voice selection priority
// ────────────────────────────────────────────

/**
 * Rank a SpeechSynthesisVoice for Spanish preference.
 * Lower score = better match.
 * Returns -1 if the voice is not Spanish at all.
 */
function rankSpanishVoice(voice: SpeechSynthesisVoice): number {
  const lang = voice.lang.toLowerCase();

  if (lang === 'es-cl') return 0;
  if (lang === 'es-mx') return 1;
  if (lang.startsWith('es-')) return 2;
  if (lang === 'es') return 3;

  return -1; // not Spanish
}

function findBestSpanishVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  let bestVoice: SpeechSynthesisVoice | null = null;
  let bestRank = Infinity;

  for (const voice of voices) {
    const rank = rankSpanishVoice(voice);
    if (rank === -1) continue;

    // Prefer female voices for a warmer tone (common for children's apps)
    const isFemale = voice.name.toLowerCase().includes('female') ||
      voice.name.toLowerCase().includes('paulina') ||
      voice.name.toLowerCase().includes('monica');
    const adjustedRank = isFemale ? rank - 0.5 : rank;

    if (adjustedRank < bestRank) {
      bestRank = adjustedRank;
      bestVoice = voice;
    }
  }

  return bestVoice;
}

// ────────────────────────────────────────────
// Hook
// ────────────────────────────────────────────

export interface UseVoiceReturn {
  speak: (text: string, onEnd?: () => void) => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
}

export function useVoice(): UseVoiceReturn {
  const { voiceEnabled, voiceRate, voicePitch } = useSettingsStore();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [spanishVoice, setSpanishVoice] = useState<SpeechSynthesisVoice | null>(null);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // ── Initialize speech synthesis and detect voices ──

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setIsSupported(false);
      return;
    }

    const synth = window.speechSynthesis;
    synthRef.current = synth;
    setIsSupported(true);

    function loadVoices() {
      const voices = synth.getVoices();
      if (voices.length > 0) {
        const best = findBestSpanishVoice(voices);
        setSpanishVoice(best);
      }
    }

    // Voices may load asynchronously
    loadVoices();
    synth.addEventListener('voiceschanged', loadVoices);

    return () => {
      synth.removeEventListener('voiceschanged', loadVoices);
      synth.cancel();
    };
  }, []);

  // ── Speak function with queue management ──

  const speak = useCallback(
    (text: string, onEnd?: () => void) => {
      const synth = synthRef.current;

      // If synthesis unavailable, disabled, or no voices loaded → fire callback immediately
      if (!synth || !voiceEnabled || synth.getVoices().length === 0) {
        onEnd?.();
        return;
      }

      // Cancel any ongoing speech to avoid overlap
      synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-CL';
      utterance.rate = voiceRate;
      utterance.pitch = voicePitch;

      if (spanishVoice) {
        utterance.voice = spanishVoice;
      }

      // Safety flag to avoid double-calling onEnd
      let ended = false;
      const fireOnEnd = () => {
        if (ended) return;
        ended = true;
        clearTimeout(safetyTimeout);
        setIsSpeaking(false);
        utteranceRef.current = null;
        onEnd?.();
      };

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = fireOnEnd;
      utterance.onerror = fireOnEnd;

      utteranceRef.current = utterance;
      synth.speak(utterance);

      // Fallback: if speech doesn't complete within 8 seconds, force-end
      const safetyTimeout = setTimeout(fireOnEnd, 8000);
    },
    [voiceEnabled, voiceRate, voicePitch, spanishVoice],
  );

  // ── Stop function ──

  const stop = useCallback(() => {
    const synth = synthRef.current;
    if (synth) {
      synth.cancel();
      setIsSpeaking(false);
      utteranceRef.current = null;
    }
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
  };
}
