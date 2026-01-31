import { useStore } from '../../store/useStore';
import { LFOControl } from './LFOControl';

export function ModulationPanel() {
    const lfos = useStore((state) => state.lfos);
    const addLfo = useStore((state) => state.addLfo);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>Modulation</h3>
                <button
                    onClick={addLfo}
                    style={{
                        background: 'transparent',
                        border: '1px solid #00ff88',
                        color: '#00ff88',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        padding: '2px 8px',
                        fontSize: '0.8rem'
                    }}
                >
                    + Add LFO
                </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {lfos.map(lfo => (
                    <LFOControl key={lfo.id} lfo={lfo} />
                ))}
            </div>
        </div>
    );
}
