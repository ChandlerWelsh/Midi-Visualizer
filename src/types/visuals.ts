export type VisualType = 'particles' | 'shapes' | 'spiral' | 'rings' | 'hexgrid' | 'cubefield' | 'waveform' | 'terrain' | 'tunnel' | 'plasma' | 'prism';

export type BlendMode = 'normal' | 'add' | 'multiply' | 'screen';

export interface VisualLayerConfig {
    id: string;
    type: VisualType;
    name: string;
    enabled: boolean;
    opacity: number;
    reactivity: number; // 0 to 2, multiplier for MIDI intensity
    blendMode: BlendMode;
    params: Record<string, any>;
}

// Particle System specific params
export interface ParticleParams {
    count: number;
    size: number;
    speed: number;
    color: string;
    spread: number;
}
