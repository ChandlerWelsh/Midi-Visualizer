import { useMidi } from '../../midi/hooks/useMidi';

export const MidiDeviceSelector = () => {
    const { devices, selectedId, selectDevice } = useMidi();

    return (
        <div style={{ pointerEvents: 'auto' }}>
            <select
                value={selectedId || ''}
                onChange={(e) => selectDevice(e.target.value)}
                style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    outline: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                }}
            >
                <option value="" disabled>Select MIDI Device</option>
                {devices.length === 0 && <option value="none" disabled>No Devices Found</option>}
                {devices.map(d => (
                    <option key={d.id} value={d.id}>
                        {d.name}
                    </option>
                ))}
            </select>
        </div>
    );
};
