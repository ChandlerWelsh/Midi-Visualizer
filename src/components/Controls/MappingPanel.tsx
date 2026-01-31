import { useStore } from '../../store/useStore';

export function MappingPanel() {
    const mappings = useStore(s => s.mappings);
    const removeMapping = useStore(s => s.removeMapping);
    const learningState = useStore(s => s.learningState);
    const cancelLearning = useStore(s => s.cancelLearning);

    if (mappings.length === 0 && !learningState.isActive) return null;

    return (
        <div style={{
            marginTop: '20px',
            paddingTop: '10px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>MIDI Mappings</h3>
                {learningState.isActive && (
                    <button
                        onClick={cancelLearning}
                        style={{ background: '#ff0055', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.7rem', padding: '2px 6px' }}
                    >
                        Cancel Learn
                    </button>
                )}
            </div>

            {mappings.map(m => (
                <div key={m.id} style={{
                    fontSize: '0.8rem',
                    background: 'rgba(0,0,0,0.3)',
                    padding: '4px',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <span>CH:{m.source.channel} CC:{m.source.cc} → {m.target.paramPath}</span>
                    <button
                        onClick={() => removeMapping(m.id)}
                        style={{ color: '#ff5555', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
}
