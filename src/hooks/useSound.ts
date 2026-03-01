import { useCallback, useEffect, useRef } from "react";

interface UseSoundOptions {
  enabled: boolean;
}

interface UseSoundReturn {
  playCorrect: () => void;
  playWrong: () => void;
  playClick: () => void;
  playStageComplete: () => void;
  playChapterComplete: () => void;
}

// Note frequencies (Hz)
const NOTE = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880.0,
  B5: 987.77,
  C6: 1046.5,
} as const;

function getAudioContext(ctxRef: React.MutableRefObject<AudioContext | null>): AudioContext {
  if (!ctxRef.current) {
    ctxRef.current = new AudioContext();
  }
  return ctxRef.current;
}

async function ensureResumed(ctx: AudioContext): Promise<void> {
  if (ctx.state === "suspended") {
    await ctx.resume();
  }
}

/**
 * Play a single tone at the given frequency, starting at `startTime` for `duration` seconds.
 * Uses a sine wave with a quick fade-in and fade-out to avoid clicks.
 */
function playTone(
  ctx: AudioContext,
  frequency: number,
  startTime: number,
  duration: number,
  gain: number = 0.15,
  waveform: OscillatorType = "sine"
): void {
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = waveform;
  osc.frequency.setValueAtTime(frequency, startTime);

  // Envelope: quick attack, sustain, quick release
  const attackTime = 0.01;
  const releaseTime = Math.min(0.05, duration * 0.3);

  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(gain, startTime + attackTime);
  gainNode.gain.setValueAtTime(gain, startTime + duration - releaseTime);
  gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
}

/**
 * Play a sequence of notes with the given timing.
 */
function playSequence(
  ctx: AudioContext,
  notes: { freq: number; duration: number; gain?: number; waveform?: OscillatorType }[],
  gap: number = 0
): void {
  let time = ctx.currentTime;
  for (const note of notes) {
    playTone(ctx, note.freq, time, note.duration, note.gain ?? 0.15, note.waveform ?? "sine");
    time += note.duration + gap;
  }
}

/**
 * Play multiple notes simultaneously as a chord.
 */
function playChord(
  ctx: AudioContext,
  frequencies: number[],
  startTime: number,
  duration: number,
  gain: number = 0.1,
  waveform: OscillatorType = "sine"
): void {
  for (const freq of frequencies) {
    playTone(ctx, freq, startTime, duration, gain, waveform);
  }
}

export function useSound({ enabled }: UseSoundOptions): UseSoundReturn {
  const ctxRef = useRef<AudioContext | null>(null);

  // Clean up AudioContext on unmount
  useEffect(() => {
    return () => {
      if (ctxRef.current) {
        ctxRef.current.close();
        ctxRef.current = null;
      }
    };
  }, []);

  const playCorrect = useCallback(() => {
    if (!enabled) return;
    const ctx = getAudioContext(ctxRef);
    ensureResumed(ctx).then(() => {
      // Ascending xylophone: C5 → E5 → G5, quick and bright
      const notes = [
        { freq: NOTE.C5, duration: 0.1, gain: 0.15, waveform: "triangle" as OscillatorType },
        { freq: NOTE.E5, duration: 0.1, gain: 0.15, waveform: "triangle" as OscillatorType },
        { freq: NOTE.G5, duration: 0.18, gain: 0.18, waveform: "triangle" as OscillatorType },
      ];
      playSequence(ctx, notes, 0.02);
    });
  }, [enabled]);

  const playWrong = useCallback(() => {
    if (!enabled) return;
    const ctx = getAudioContext(ctxRef);
    ensureResumed(ctx).then(() => {
      // Gentle descending tone: E4 → C4, soft and not scary
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(NOTE.E4, t);
      osc.frequency.linearRampToValueAtTime(NOTE.C4, t + 0.3);

      gainNode.gain.setValueAtTime(0, t);
      gainNode.gain.linearRampToValueAtTime(0.1, t + 0.02);
      gainNode.gain.setValueAtTime(0.1, t + 0.2);
      gainNode.gain.linearRampToValueAtTime(0, t + 0.35);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.35);
    });
  }, [enabled]);

  const playClick = useCallback(() => {
    if (!enabled) return;
    const ctx = getAudioContext(ctxRef);
    ensureResumed(ctx).then(() => {
      // Very short, soft tap sound
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(800, t);
      osc.frequency.exponentialRampToValueAtTime(400, t + 0.04);

      gainNode.gain.setValueAtTime(0.08, t);
      gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.06);
    });
  }, [enabled]);

  const playStageComplete = useCallback(() => {
    if (!enabled) return;
    const ctx = getAudioContext(ctxRef);
    ensureResumed(ctx).then(() => {
      // Celebratory ascending arpeggio with a final chord
      const noteStep = 0.12;
      const arpeggioNotes = [NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6];
      let t = ctx.currentTime;

      // Ascending arpeggio
      for (const freq of arpeggioNotes) {
        playTone(ctx, freq, t, 0.15, 0.15, "triangle");
        t += noteStep;
      }

      // Final celebratory chord (C major, held longer)
      t += 0.05;
      playChord(ctx, [NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6], t, 0.5, 0.1, "triangle");
    });
  }, [enabled]);

  const playChapterComplete = useCallback(() => {
    if (!enabled) return;
    const ctx = getAudioContext(ctxRef);
    ensureResumed(ctx).then(() => {
      const noteStep = 0.1;
      // Longer ascending run through the scale
      const melodyNotes = [
        NOTE.C4, NOTE.E4, NOTE.G4, NOTE.C5,
        NOTE.E5, NOTE.G5, NOTE.C6,
      ];
      let t = ctx.currentTime;

      // Run up
      for (let i = 0; i < melodyNotes.length; i++) {
        const gain = 0.1 + (i / melodyNotes.length) * 0.08;
        playTone(ctx, melodyNotes[i], t, 0.13, gain, "triangle");
        t += noteStep;
      }

      // Pause before final fanfare
      t += 0.08;

      // Two triumphant chords
      playChord(ctx, [NOTE.C5, NOTE.E5, NOTE.G5], t, 0.3, 0.12, "triangle");
      t += 0.35;
      playChord(ctx, [NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6], t, 0.7, 0.14, "triangle");

      // Add a gentle shimmer on top of the final chord
      playTone(ctx, NOTE.C6, t + 0.1, 0.5, 0.06, "sine");
      playTone(ctx, NOTE.G5, t + 0.15, 0.45, 0.05, "sine");
    });
  }, [enabled]);

  return { playCorrect, playWrong, playClick, playStageComplete, playChapterComplete };
}
