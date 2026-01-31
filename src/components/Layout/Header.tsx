import { MidiDeviceSelector } from '../Controls/MidiDeviceSelector';
import { PresetSelector } from './PresetSelector';
import { InputModeSelector } from '../Controls/InputModeSelector';
export function Header() {
    return (
        <header style={{
            height: '60px',
            background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            gridArea: 'header'
        }}>
            <h1 style={{ margin: 0, fontSize: '1.2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.5rem' }}>🎹</span>
                Synthesia v0.5
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <InputModeSelector />
                <PresetSelector />
                <MidiDeviceSelector />
            </div>
        </header>
    );
}
