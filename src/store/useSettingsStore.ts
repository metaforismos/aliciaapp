import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ────────────────────────────────────────────
// Store interface
// ────────────────────────────────────────────

interface SettingsState {
  // State
  voiceEnabled: boolean;
  voiceRate: number;
  voicePitch: number;
  maxSessionMinutes: number;
  parentPin: string;

  // Actions
  setVoiceEnabled: (enabled: boolean) => void;
  setVoiceRate: (rate: number) => void;
  setVoicePitch: (pitch: number) => void;
  setMaxSessionMinutes: (minutes: number) => void;
  setParentPin: (pin: string) => void;
  verifyPin: (pin: string) => boolean;
}

// ────────────────────────────────────────────
// Store
// ────────────────────────────────────────────

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // ── Initial state ──────────────────────
      voiceEnabled: true,
      voiceRate: 0.9,
      voicePitch: 1.1,
      maxSessionMinutes: 15,
      parentPin: '1234',

      // ── Actions ────────────────────────────

      setVoiceEnabled: (enabled: boolean) => {
        set({ voiceEnabled: enabled });
      },

      setVoiceRate: (rate: number) => {
        // Clamp rate between 0.5 and 2.0
        set({ voiceRate: Math.max(0.5, Math.min(2.0, rate)) });
      },

      setVoicePitch: (pitch: number) => {
        // Clamp pitch between 0.5 and 2.0
        set({ voicePitch: Math.max(0.5, Math.min(2.0, pitch)) });
      },

      setMaxSessionMinutes: (minutes: number) => {
        // Clamp between 5 and 60 minutes
        set({ maxSessionMinutes: Math.max(5, Math.min(60, minutes)) });
      },

      setParentPin: (pin: string) => {
        // Only accept 4-digit PINs
        if (/^\d{4}$/.test(pin)) {
          set({ parentPin: pin });
        }
      },

      verifyPin: (pin: string) => {
        return get().parentPin === pin;
      },
    }),
    {
      name: 'aliciaapp-settings',
    },
  ),
);
