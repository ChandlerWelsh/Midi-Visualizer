export type LfoShape = 'sine' | 'triangle' | 'square' | 'saw';

export interface LfoConfig {
    id: string;
    name: string;
    shape: LfoShape;
    rate: number; // Hz
    depth: number; // 0-1
    enabled: boolean;
}

export interface EnvelopeConfig {
    id: string;
    name: string;
    attack: number; // seconds
    decay: number; // seconds
    sustain: number; // 0-1
    release: number; // seconds
    enabled: boolean;
}

export type ModulationSource =
    | { type: 'lfo'; id: string }
    | { type: 'envelope'; id: string }
    | { type: 'midi'; channel: number; cc: number };

export interface ModulationTarget {
    layerId: string;
    paramKey: string;
}

export interface ModulationRouting {
    id: string;
    source: ModulationSource;
    target: ModulationTarget;
    amount: number; // -1 to 1
}
