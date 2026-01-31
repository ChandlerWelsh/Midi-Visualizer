import { useStore } from '../../store/useStore';
import { audioManager } from '../../audio/AudioManager';

export function InputModeSelector() {
    const inputMode = useStore(s => s.inputMode);
    const setInputMode = useStore(s => s.setInputMode);

    const toggle = () => {
        if (inputMode === 'mix') setInputMode('midi');
        else if (inputMode === 'midi') {
            audioManager.init(); // Ensure init when switching to audio
            setInputMode('audio');
        }
        else setInputMode('mix');
    };

    return (
        <button
            onClick={toggle}
            title="Click to toggle Input Mode"
            style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid var(--border-color)',
                color: inputMode === 'midi' ? '#00ccff' : (inputMode === 'audio' ? '#ff0055' : '#00ff88'),
                padding: '4px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                minWidth: '60px'
            }}
        >
            {inputMode.toUpperCase()}
        </button>
    );
}
