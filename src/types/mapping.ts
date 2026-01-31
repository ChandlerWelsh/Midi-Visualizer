export interface MidiMapping {
    id: string;
    source: {
        channel: number;
        cc: number;
    };
    target: {
        type: 'layer' | 'lfo';
        targetId: string; // layerId or lfoId
        paramPath: string; // e.g., 'opacity', 'params.count'
        min?: number;
        max?: number;
    };
}

export interface LearningState {
    isActive: boolean;
    targetId: string | null;
    paramPath: string | null;
    targetType: 'layer' | 'lfo' | null;
}
