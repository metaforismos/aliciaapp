import { useCallback, useEffect, useRef } from "react";

interface UseBackgroundMusicReturn {
  start: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
  isPlaying: boolean;
}

// Pentatonic scale notes for a calm, forest/nature feel (C pentatonic)
const PENTATONIC = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  G4: 392.0,
  A4: 440.0,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  G5: 783.99,
} as const;

// A gentle repeating melody pattern using pentatonic intervals.
// Each entry is [frequency, durationInBeats]. One beat ~ 0.6s for a calm tempo.
const MELODY_PATTERN: [number, number][] = [
  [PENTATONIC.C4, 2],
  [PENTATONIC.E4, 1],
  [PENTATONIC.G4, 1],
  [PENTATONIC.A4, 2],
  [PENTATONIC.G4, 2],
  [PENTATONIC.E4, 1],
  [PENTATONIC.D4, 1],
  [PENTATONIC.C4, 2],
  [0, 2], // rest
  [PENTATONIC.G4, 1],
  [PENTATONIC.A4, 1],
  [PENTATONIC.C5, 2],
  [PENTATONIC.A4, 1],
  [PENTATONIC.G4, 1],
  [PENTATONIC.E4, 2],
  [PENTATONIC.D4, 2],
  [PENTATONIC.C4, 2],
  [0, 2], // rest
];

const BEAT_DURATION = 0.6; // seconds per beat

export function useBackgroundMusic(): UseBackgroundMusicReturn {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const isPlayingRef = useRef(false);
  const schedulerIdRef = useRef<number | null>(null);
  const nextNoteTimeRef = useRef(0);
  const patternIndexRef = useRef(0);
  const activeOscillatorsRef = useRef<OscillatorNode[]>([]);

  function getContext(): AudioContext {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    return ctxRef.current;
  }

  function scheduleNote(ctx: AudioContext, masterGain: GainNode): void {
    const [freq, beats] = MELODY_PATTERN[patternIndexRef.current];
    const duration = beats * BEAT_DURATION;
    const startTime = nextNoteTimeRef.current;

    if (freq > 0) {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      // Soft envelope
      const attackTime = 0.08;
      const releaseTime = Math.min(0.15, duration * 0.4);

      noteGain.gain.setValueAtTime(0, startTime);
      noteGain.gain.linearRampToValueAtTime(1, startTime + attackTime);
      noteGain.gain.setValueAtTime(1, startTime + duration - releaseTime);
      noteGain.gain.linearRampToValueAtTime(0, startTime + duration);

      osc.connect(noteGain);
      noteGain.connect(masterGain);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.01);

      activeOscillatorsRef.current.push(osc);

      // Clean up reference after the note ends
      osc.onended = () => {
        const idx = activeOscillatorsRef.current.indexOf(osc);
        if (idx !== -1) {
          activeOscillatorsRef.current.splice(idx, 1);
        }
      };
    }

    nextNoteTimeRef.current += duration;
    patternIndexRef.current = (patternIndexRef.current + 1) % MELODY_PATTERN.length;
  }

  /**
   * Scheduler loop: looks ahead and schedules notes that fall within the next
   * scheduling window. Uses requestAnimationFrame for efficiency.
   */
  function schedulerLoop(): void {
    if (!isPlayingRef.current || !ctxRef.current || !masterGainRef.current) return;

    const ctx = ctxRef.current;
    const masterGain = masterGainRef.current;
    const lookAheadTime = 0.5; // schedule notes up to 0.5s ahead

    while (nextNoteTimeRef.current < ctx.currentTime + lookAheadTime) {
      scheduleNote(ctx, masterGain);
    }

    schedulerIdRef.current = requestAnimationFrame(schedulerLoop);
  }

  const start = useCallback(() => {
    if (isPlayingRef.current) return;

    const ctx = getContext();

    const resumeAndPlay = () => {
      if (!masterGainRef.current) {
        masterGainRef.current = ctx.createGain();
        masterGainRef.current.gain.setValueAtTime(0.06, ctx.currentTime);
        masterGainRef.current.connect(ctx.destination);
      }

      isPlayingRef.current = true;
      patternIndexRef.current = 0;
      nextNoteTimeRef.current = ctx.currentTime + 0.1; // small initial delay
      schedulerLoop();
    };

    if (ctx.state === "suspended") {
      ctx.resume().then(resumeAndPlay);
    } else {
      resumeAndPlay();
    }
  }, []);

  const stop = useCallback(() => {
    isPlayingRef.current = false;

    if (schedulerIdRef.current !== null) {
      cancelAnimationFrame(schedulerIdRef.current);
      schedulerIdRef.current = null;
    }

    // Fade out and stop all active oscillators
    if (ctxRef.current && masterGainRef.current) {
      const t = ctxRef.current.currentTime;
      masterGainRef.current.gain.setValueAtTime(
        masterGainRef.current.gain.value,
        t
      );
      masterGainRef.current.gain.linearRampToValueAtTime(0, t + 0.3);
    }

    // Stop oscillators after fade-out
    setTimeout(() => {
      for (const osc of activeOscillatorsRef.current) {
        try {
          osc.stop();
        } catch {
          // Already stopped
        }
      }
      activeOscillatorsRef.current = [];

      // Reset master gain for next start
      if (masterGainRef.current) {
        masterGainRef.current.disconnect();
        masterGainRef.current = null;
      }
    }, 350);
  }, []);

  const setVolume = useCallback((volume: number) => {
    const clamped = Math.max(0, Math.min(1, volume));
    if (ctxRef.current && masterGainRef.current) {
      const t = ctxRef.current.currentTime;
      masterGainRef.current.gain.setValueAtTime(
        masterGainRef.current.gain.value,
        t
      );
      masterGainRef.current.gain.linearRampToValueAtTime(clamped, t + 0.1);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isPlayingRef.current = false;

      if (schedulerIdRef.current !== null) {
        cancelAnimationFrame(schedulerIdRef.current);
        schedulerIdRef.current = null;
      }

      for (const osc of activeOscillatorsRef.current) {
        try {
          osc.stop();
        } catch {
          // Already stopped
        }
      }
      activeOscillatorsRef.current = [];

      if (ctxRef.current) {
        ctxRef.current.close();
        ctxRef.current = null;
      }
    };
  }, []);

  return {
    start,
    stop,
    setVolume,
    isPlaying: isPlayingRef.current,
  };
}
