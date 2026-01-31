import { useStore } from '../../store/useStore';
import { defaultPresets } from '../../presets/defaultPresets';

export function PresetSelector() {
    const loadPreset = useStore(s => s.loadPreset);

    return (
        <select
            onChange={(e) => {
                const preset = defaultPresets.find(p => p.id === e.target.value);
                if (preset) {
                    loadPreset({ layers: preset.layers, lfos: preset.lfos });
                }
            }}
            defaultValue="default"
            style={{
                background: '#0a0a0a',
                color: '#fff',
                border: '1px solid var(--border-color)',
                padding: '4px 8px',
                borderRadius: '4px',
                fontFamily: 'inherit',
                fontSize: '0.9rem'
            }}
        >
            <option disabled value="">Select Preset...</option>
            {defaultPresets.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
            ))}
        </select>
    );
}
