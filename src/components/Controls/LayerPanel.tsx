import { useStore } from '../../store/useStore';
import { Slider } from '../common/Slider';
import type { VisualType } from '../../types/visuals';

export function LayerPanel() {
    const layers = useStore((state) => state.layers);
    const updateLayer = useStore((state) => state.updateLayer);
    const addLayer = useStore((state) => state.addLayer);
    const removeLayer = useStore((state) => state.removeLayer);

    const handleAddLayer = () => {
        addLayer({
            id: crypto.randomUUID(),
            type: 'particles',
            name: `Layer ${layers.length + 1}`,
            enabled: true,
            opacity: 1,
            reactivity: 1.0,
            blendMode: 'normal',
            params: { count: 1000 }
        });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Layers</h2>
                <button
                    onClick={handleAddLayer}
                    style={{
                        padding: '4px 8px',
                        background: '#00ff88',
                        color: '#000',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    + Add Layer
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {layers.map((layer) => (
                    <div key={layer.id} style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '8px',
                        padding: '10px',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <input
                                value={layer.name}
                                onChange={(e) => updateLayer(layer.id, { name: e.target.value })}
                                style={{ background: 'transparent', border: 'none', color: '#fff', fontWeight: 'bold' }}
                            />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    type="checkbox"
                                    checked={layer.enabled}
                                    onChange={(e) => updateLayer(layer.id, { enabled: e.target.checked })}
                                    style={{ accentColor: '#00ff88' }}
                                />
                                <button
                                    onClick={() => removeLayer(layer.id)}
                                    style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer' }}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div style={{ gridColumn: '1 / -1', marginBottom: '5px' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: '#888' }}>Type</label>
                                <select
                                    value={layer.type}
                                    onChange={(e) => updateLayer(layer.id, { type: e.target.value as VisualType })}
                                    style={{
                                        width: '100%',
                                        background: '#000',
                                        color: '#fff',
                                        border: '1px solid #333',
                                        padding: '4px',
                                        borderRadius: '4px'
                                    }}
                                >
                                    <option value="particles">Particles</option>
                                    <option value="shapes">Shapes</option>
                                    <option value="spiral">Spiral</option>
                                    <option value="rings">Rings</option>
                                    <option value="hexgrid">Hex Grid</option>
                                    <option value="cubefield">Cube Field</option>
                                    <option value="waveform">Waveform</option>
                                    <option value="terrain">Terrain</option>
                                    <option value="tunnel">Tunnel</option>
                                    <option value="plasma">Plasma</option>
                                    <option value="prism">Prism</option>
                                </select>
                            </div>

                            <Slider
                                label="Opacity"
                                value={layer.opacity}
                                min={0}
                                max={1}
                                step={0.01}
                                learnId={layer.id}
                                paramPath="opacity"
                                targetType="layer"
                                onChange={(e) => updateLayer(layer.id, { opacity: parseFloat(e.target.value) })}
                            />

                            <Slider
                                label="Midi Sense"
                                value={layer.reactivity ?? 1.0}
                                min={0}
                                max={0.5}
                                step={0.01}
                                learnId={layer.id}
                                paramPath="reactivity"
                                targetType="layer"
                                onChange={(e) => updateLayer(layer.id, { reactivity: parseFloat(e.target.value) })}
                            />

                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: '#888' }}>Blend Mode</label>
                                <select
                                    value={layer.blendMode}
                                    onChange={(e) => updateLayer(layer.id, { blendMode: e.target.value as any })}
                                    style={{
                                        width: '100%',
                                        background: '#000',
                                        color: '#fff',
                                        border: '1px solid #333',
                                        padding: '4px',
                                        borderRadius: '4px'
                                    }}
                                >
                                    <option value="normal">Normal</option>
                                    <option value="add">Add</option>
                                    <option value="screen">Screen</option>
                                    <option value="multiply">Multiply</option>
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
