import { useStore } from '../store/useStore';
import { midiManager } from '../midi/MidiManager';
import { audioManager } from '../audio/AudioManager';
import { useCallback } from 'react';

export function useInputIntensity() {
    const inputMode = useStore(state => state.inputMode);

    return useCallback((reactivity: number = 1.0) => {
        // 1. Audio Data
        const audio = audioManager.getAnalysis();

        // 2. MIDI Data
        const activeNotes = midiManager.getActiveNotes();
        let midiBass = 0;
        let midiMid = 0;
        let midiTreble = 0;
        let midiTotal = 0;
        let noteCount = 0;

        activeNotes.forEach((velocity, key) => {
            const noteNum = parseInt(key.split('-')[1]);
            noteCount++;
            midiTotal += velocity;

            if (noteNum < 48) midiBass += velocity;
            else if (noteNum > 72) midiTreble += velocity;
            else midiMid += velocity;
        });

        // Normalize MIDI
        const midiIntensity = noteCount > 0 ? (midiTotal / 1) : 0;

        // 3. Blend based on Mode
        let combined = {
            intensity: 0,
            bass: 0,
            mid: 0,
            treble: 0
        };

        const applyMidi = () => {
            combined.intensity = Math.min(1, midiIntensity * reactivity);
            combined.bass = Math.min(1, midiBass * reactivity);
            combined.mid = Math.min(1, midiMid * reactivity);
            combined.treble = Math.min(1, midiTreble * reactivity);
        };

        const applyAudio = () => {
            // Audio is usually 0-1, multiply by reactivity
            combined.intensity = Math.min(1, audio.volume * reactivity * 2);
            combined.bass = Math.min(1, audio.bass * reactivity * 2);
            combined.mid = Math.min(1, audio.mid * reactivity * 2);
            combined.treble = Math.min(1, audio.treble * reactivity * 2);
        };

        if (inputMode === 'midi') {
            applyMidi();
        } else if (inputMode === 'audio') {
            applyAudio();
        } else {
            // MIX: Take Max
            applyMidi();
            const m = { ...combined };

            // Reset for audio and apply
            combined.intensity = 0; combined.bass = 0; combined.mid = 0; combined.treble = 0;
            applyAudio();
            const a = { ...combined };

            combined.intensity = Math.max(m.intensity, a.intensity);
            combined.bass = Math.max(m.bass, a.bass);
            combined.mid = Math.max(m.mid, a.mid);
            combined.treble = Math.max(m.treble, a.treble);
        }

        return combined;
    }, [inputMode]);
}
