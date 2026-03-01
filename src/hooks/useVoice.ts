import { useState, useCallback, useEffect, useRef } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';

// ────────────────────────────────────────────
// Spanish voice selection priority (TTS fallback)
// ────────────────────────────────────────────

function rankSpanishVoice(voice: SpeechSynthesisVoice): number {
  const lang = voice.lang.toLowerCase();
  if (lang === 'es-cl') return 0;
  if (lang === 'es-mx') return 1;
  if (lang.startsWith('es-')) return 2;
  if (lang === 'es') return 3;
  return -1;
}

function findBestSpanishVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  let bestVoice: SpeechSynthesisVoice | null = null;
  let bestRank = Infinity;

  for (const voice of voices) {
    const rank = rankSpanishVoice(voice);
    if (rank === -1) continue;

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
// Pre-recorded audio cache
// ────────────────────────────────────────────

/** Cache of audio files that we've confirmed exist (or confirmed don't exist). */
const audioExistsCache = new Map<string, boolean>();

/**
 * Check if a pre-recorded audio file exists by trying to fetch its headers.
 * Results are cached to avoid repeated network requests.
 */
async function checkAudioExists(path: string): Promise<boolean> {
  const cached = audioExistsCache.get(path);
  if (cached !== undefined) return cached;

  try {
    const res = await fetch(path, { method: 'HEAD' });
    const exists = res.ok;
    audioExistsCache.set(path, exists);
    return exists;
  } catch {
    audioExistsCache.set(path, false);
    return false;
  }
}

// ────────────────────────────────────────────
// Types
// ────────────────────────────────────────────

export interface VoiceOverride {
  rate?: number;
  pitch?: number;
}

export interface UseVoiceReturn {
  /**
   * Speak text using either pre-recorded audio (if audioPath provided and exists)
   * or Web Speech API (TTS) as fallback.
   *
   * @param text          - Text to speak (used for TTS fallback)
   * @param onEnd         - Callback when speech finishes
   * @param voiceOverride - TTS rate/pitch override (ignored when using audio file)
   * @param audioPath     - Optional path to pre-recorded audio file
   */
  speak: (text: string, onEnd?: () => void, voiceOverride?: VoiceOverride, audioPath?: string | null) => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
}

// ────────────────────────────────────────────
// Hook
// ────────────────────────────────────────────

export function useVoice(): UseVoiceReturn {
  const { voiceEnabled, voiceRate, voicePitch } = useSettingsStore();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [spanishVoice, setSpanishVoice] = useState<SpeechSynthesisVoice | null>(null);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const safetyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Initialize speech synthesis ──

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

    loadVoices();
    synth.addEventListener('voiceschanged', loadVoices);

    return () => {
      synth.removeEventListener('voiceschanged', loadVoices);
      synth.cancel();
    };
  }, []);

  // ── Cleanup on unmount ──

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
      }
    };
  }, []);

  // ── Stop any active playback ──

  const stopPlayback = useCallback(() => {
    // Stop pre-recorded audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    // Stop TTS
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    // Clear safety timeout
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }
    utteranceRef.current = null;
    setIsSpeaking(false);
  }, []);

  // ── Play pre-recorded audio ──

  const playAudioFile = useCallback(
    (path: string, onEnd?: () => void) => {
      stopPlayback();

      const audio = new Audio(path);
      audioRef.current = audio;

      let ended = false;
      const fireOnEnd = () => {
        if (ended) return;
        ended = true;
        if (safetyTimeoutRef.current) {
          clearTimeout(safetyTimeoutRef.current);
          safetyTimeoutRef.current = null;
        }
        audioRef.current = null;
        setIsSpeaking(false);
        onEnd?.();
      };

      audio.onplay = () => setIsSpeaking(true);
      audio.onended = fireOnEnd;
      audio.onerror = fireOnEnd;

      // Safety: max 15 seconds for audio playback
      safetyTimeoutRef.current = setTimeout(fireOnEnd, 15000);

      audio.play().catch(() => {
        // Audio file failed to play — fire callback
        fireOnEnd();
      });
    },
    [stopPlayback],
  );

  // ── Speak with TTS (Web Speech API fallback) ──

  const speakTTS = useCallback(
    (text: string, onEnd?: () => void, voiceOverride?: VoiceOverride) => {
      const synth = synthRef.current;

      if (!synth || !voiceEnabled || synth.getVoices().length === 0) {
        onEnd?.();
        return;
      }

      synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-CL';
      utterance.rate = voiceOverride?.rate ?? voiceRate;
      utterance.pitch = voiceOverride?.pitch ?? voicePitch;

      if (spanishVoice) {
        utterance.voice = spanishVoice;
      }

      let ended = false;
      const fireOnEnd = () => {
        if (ended) return;
        ended = true;
        if (safetyTimeoutRef.current) {
          clearTimeout(safetyTimeoutRef.current);
          safetyTimeoutRef.current = null;
        }
        setIsSpeaking(false);
        utteranceRef.current = null;
        onEnd?.();
      };

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = fireOnEnd;
      utterance.onerror = fireOnEnd;

      utteranceRef.current = utterance;
      synth.speak(utterance);

      safetyTimeoutRef.current = setTimeout(fireOnEnd, 8000);
    },
    [voiceEnabled, voiceRate, voicePitch, spanishVoice],
  );

  // ── Main speak function: tries audio file first, falls back to TTS ──

  const speak = useCallback(
    (text: string, onEnd?: () => void, voiceOverride?: VoiceOverride, audioPath?: string | null) => {
      if (!voiceEnabled) {
        onEnd?.();
        return;
      }

      // If we have an audio path, try to use it
      if (audioPath) {
        checkAudioExists(audioPath).then((exists) => {
          if (exists) {
            playAudioFile(audioPath, onEnd);
          } else {
            // Fallback to TTS
            speakTTS(text, onEnd, voiceOverride);
          }
        });
        return;
      }

      // No audio path — use TTS directly
      speakTTS(text, onEnd, voiceOverride);
    },
    [voiceEnabled, playAudioFile, speakTTS],
  );

  return {
    speak,
    stop: stopPlayback,
    isSpeaking,
    isSupported,
  };
}
