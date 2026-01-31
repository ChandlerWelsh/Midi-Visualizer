import type { VisualLayerConfig } from '../types/visuals';
import type { LfoConfig } from '../types/modulation';

export interface Preset {
    id: string;
    name: string;
    layers: VisualLayerConfig[];
    lfos: LfoConfig[];
}

export const defaultPresets: Preset[] = [
    {
        id: 'default',
        name: 'Default Particles',
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
        lfos: [
            { id: 'lfo-1', name: 'Orbit LFO', shape: 'sine', rate: 0.5, depth: 1, enabled: true },
            { id: 'lfo-2', name: 'Pulse LFO', shape: 'saw', rate: 2.0, depth: 0.5, enabled: true },
        ]
    },
    {
        id: 'hyperspiral',
        name: 'Hyperspiral',
        layers: [
            {
                id: 'lyr-spiral',
                type: 'spiral',
                name: 'Golden Spiral',
                enabled: true,
                opacity: 1,
                reactivity: 1.5,
                blendMode: 'normal',
                params: { count: 3000 }
            }
        ],
        lfos: [
            { id: 'lfo-1', name: 'Breath', shape: 'sine', rate: 0.2, depth: 0.5, enabled: true }
        ]
    },
    {
        id: 'saturn-rings',
        name: 'Saturn Rings',
        layers: [
            {
                id: 'lyr-rings',
                type: 'rings',
                name: 'Cosmic Bands',
                enabled: true,
                opacity: 0.8,
                reactivity: 1.2,
                blendMode: 'add',
                params: { count: 2000 }
            }
        ],
        lfos: [
            { id: 'lfo-1', name: 'Wobble', shape: 'sine', rate: 0.5, depth: 0.2, enabled: true },
            { id: 'lfo-2', name: 'Fade', shape: 'triangle', rate: 0.1, depth: 0.5, enabled: true }
        ]
    },
    {
        id: 'cyber-hex',
        name: 'Cyber Hex',
        layers: [
            {
                id: 'lyr-hex',
                type: 'hexgrid',
                name: 'Grid Main',
                enabled: true,
                opacity: 1,
                reactivity: 2.0,
                blendMode: 'normal',
                params: { count: 1200 }
            }
        ],
        lfos: [
            { id: 'lfo-1', name: 'Wave', shape: 'sine', rate: 1.0, depth: 0.8, enabled: true }
        ]
    },
    {
        id: 'voxel-land',
        name: 'Voxel Land',
        layers: [
            {
                id: 'lyr-cube',
                type: 'cubefield',
                name: 'Jumpers',
                enabled: true,
                opacity: 1,
                reactivity: 1.5,
                blendMode: 'normal',
                params: { count: 1000 }
            }
        ],
        lfos: []
    },
    {
        id: 'mountain-high',
        name: 'Mountain High',
        layers: [
            {
                id: 'lyr-terr',
                type: 'terrain',
                name: 'Landscape',
                enabled: true,
                opacity: 1,
                reactivity: 1.0,
                blendMode: 'normal',
                params: { count: 64 }
            }
        ],
        lfos: []
    },
    {
        id: 'neon-pulse',
        name: 'Neon Pulse',
        layers: [
            {
                id: 'lyr-plasma',
                type: 'plasma',
                name: 'Plasma Bg',
                enabled: true,
                opacity: 0.5,
                reactivity: 0.5,
                blendMode: 'screen',
                params: { count: 1 }
            },
            {
                id: 'lyr-rings-2',
                type: 'rings',
                name: 'Overlay Rings',
                enabled: true,
                opacity: 0.8,
                reactivity: 1.5,
                blendMode: 'add',
                params: { count: 1500 }
            }
        ],
        lfos: []
    },
    {
        id: 'data-stream',
        name: 'Data Stream',
        layers: [
            {
                id: 'lyr-tunnel',
                type: 'tunnel',
                name: 'Wormhole',
                enabled: true,
                opacity: 1,
                reactivity: 1.0,
                blendMode: 'normal',
                params: { count: 100 }
            },
            {
                id: 'lyr-wave',
                type: 'waveform',
                name: 'Signal',
                enabled: true,
                opacity: 1,
                reactivity: 2.0,
                blendMode: 'add',
                params: { count: 200 }
            }
        ],
        lfos: []
    },
    {
        id: 'prism-light',
        name: 'Prism Light',
        layers: [
            {
                id: 'lyr-prism',
                type: 'prism',
                name: 'Crystal',
                enabled: true,
                opacity: 1,
                reactivity: 1.5,
                blendMode: 'normal',
                params: { count: 50 }
            }
        ],
        lfos: []
    }
];
