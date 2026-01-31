import { useStore } from '../../store/useStore';
import type { LfoConfig, LfoShape } from '../../types/modulation';
import { Slider } from '../common/Slider';

interface Props {
    lfo: LfoConfig;
}

export function LFOControl({ lfo }: Props) {
    const updateLfo = useStore(state => state.updateLfo);

    return (
        <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '6px',
            padding: '8px',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{lfo.name}</span>
                <input
                    type="checkbox"
                    checked={lfo.enabled}
                    onChange={(e) => updateLfo(lfo.id, { enabled: e.target.checked })}
                    style={{ accentColor: '#00ff88' }}
                />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
                <select
                    value={lfo.shape}
                    onChange={(e) => updateLfo(lfo.id, { shape: e.target.value as LfoShape })}
                    style={{
                        background: '#000',
                        color: '#fff',
                        border: '1px solid #333',
                        fontSize: '0.7rem',
                        borderRadius: '4px'
                    }}
                >
                    <option value="sine">Sine</option>
                    <option value="triangle">Triangle</option>
                    <option value="square">Square</option>
                    <option value="saw">Saw</option>
                </select>

                <div style={{ flex: 1 }}>
                    <Slider
                        label="Rate"
                        value={lfo.rate}
                        min={0.1}
                        max={5}
                        step={0.1}
                        learnId={lfo.id}
                        paramPath="rate"
                        targetType="lfo"
                        onChange={(e) => updateLfo(lfo.id, { rate: parseFloat(e.target.value) })}
                    />
                </div>
            </div>

            <Slider
                label="Depth"
                value={lfo.depth}
                min={0}
                max={1}
                step={0.01}
                learnId={lfo.id}
                paramPath="depth"
                targetType="lfo"
                onChange={(e) => updateLfo(lfo.id, { depth: parseFloat(e.target.value) })}
            />
        </div>
    );
}
