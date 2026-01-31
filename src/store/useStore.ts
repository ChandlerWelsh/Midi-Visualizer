import { create } from 'zustand';
import type { MidiDevice } from '../types/midi';
import type { VisualLayerConfig } from '../types/visuals';
import type { LfoConfig, EnvelopeConfig } from '../types/modulation';
import type { MidiMapping, LearningState } from '../types/mapping';

interface AppState {
    midiDevices: MidiDevice[];
    selectedDeviceId: string | null;
    setMidiDevices: (devices: MidiDevice[]) => void;
    setSelectedDeviceId: (id: string | null) => void;

    // Visual Layers
    layers: VisualLayerConfig[];
    addLayer: (layer: VisualLayerConfig) => void;
    removeLayer: (id: string) => void;
    updateLayer: (id: string, updates: Partial<VisualLayerConfig>) => void;
    setLayers: (layers: VisualLayerConfig[]) => void;

    // Modulation
    lfos: LfoConfig[];
    envelopes: EnvelopeConfig[];
    updateLfo: (id: string, updates: Partial<LfoConfig>) => void;
    updateEnvelope: (id: string, updates: Partial<EnvelopeConfig>) => void;
    addLfo: () => void;
    removeLfo: (id: string) => void;

    // Audio / Input
    inputMode: 'midi' | 'audio' | 'mix'; // Default mix
    setInputMode: (mode: 'midi' | 'audio' | 'mix') => void;

    // MIDI Mapping
    mappings: MidiMapping[];
    learningState: LearningState;
    addMapping: (mapping: MidiMapping) => void;
    removeMapping: (id: string) => void;
    setLearningTarget: (type: 'layer' | 'lfo' | null, id: string | null, param: string | null) => void;
    cancelLearning: () => void;

    // Presets
    loadPreset: (preset: { layers: VisualLayerConfig[], lfos: LfoConfig[] }) => void;
}

export const useStore = create<AppState>((set) => ({
    midiDevices: [],
    selectedDeviceId: null,
    setMidiDevices: (devices) => set({ midiDevices: devices }),
    setSelectedDeviceId: (id) => set({ selectedDeviceId: id }),

    layers: [
        {
            id: 'layer-1',
            type: 'particles',
            name: 'Base Particles',
            enabled: true,
            opacity: 1.0,
            reactivity: 1.0,
            blendMode: 'screen',
            params: { count: 3000 }
        }
    ],
    addLayer: (layer) => set((state) => ({ layers: [...state.layers, layer] })),
    removeLayer: (id) => set((state) => ({ layers: state.layers.filter(l => l.id !== id) })),
    updateLayer: (id, updates) => set((state) => ({
        layers: state.layers.map(l => l.id === id ? { ...l, ...updates } : l)
    })),
    setLayers: (layers) => set({ layers }),

    lfos: [
        { id: 'lfo-1', name: 'LFO 1', shape: 'sine', rate: 0.5, depth: 1, enabled: true },
        { id: 'lfo-2', name: 'LFO 2', shape: 'saw', rate: 2.0, depth: 0.5, enabled: true },
    ],
    envelopes: [
        { id: 'env-1', name: 'Env 1', attack: 0.1, decay: 0.2, sustain: 0.5, release: 0.5, enabled: true }
    ],
    updateLfo: (id, updates) => set((state) => ({
        lfos: state.lfos.map(l => l.id === id ? { ...l, ...updates } : l)
    })),
    updateEnvelope: (id, updates) => set((state) => ({
        envelopes: state.envelopes.map(e => e.id === id ? { ...e, ...updates } : e)
    })),
    addLfo: () => set((state) => ({
        lfos: [...state.lfos, {
            id: crypto.randomUUID(),
            name: `LFO ${state.lfos.length + 1}`,
            shape: 'sine',
            rate: 1.0,
            depth: 0.5,
            enabled: true
        }]
    })),
    removeLfo: (id) => set((state) => ({
        lfos: state.lfos.filter(l => l.id !== id)
    })),

    inputMode: 'mix',
    setInputMode: (mode) => set({ inputMode: mode }),

    mappings: [],
    learningState: { isActive: false, targetId: null, paramPath: null, targetType: null },
    addMapping: (mapping) => set((state) => {
        // Remove existing mapping for this param to avoid conflicts
        const filtered = state.mappings.filter(m =>
            !(m.target.targetId === mapping.target.targetId && m.target.paramPath === mapping.target.paramPath)
        );
        return {
            mappings: [...filtered, mapping],
            learningState: { isActive: false, targetId: null, paramPath: null, targetType: null } // Reset learning
        };
    }),
    removeMapping: (id) => set((state) => ({ mappings: state.mappings.filter(m => m.id !== id) })),
    setLearningTarget: (type, id, param) => set({
        learningState: { isActive: !!(type && id && param), targetId: id, paramPath: param, targetType: type }
    }),
    cancelLearning: () => set({
        learningState: { isActive: false, targetId: null, paramPath: null, targetType: null }
    }),

    loadPreset: (preset) => set({
        layers: preset.layers.map(l => ({ ...l, id: crypto.randomUUID() })),
        lfos: preset.lfos
    }),
}));
