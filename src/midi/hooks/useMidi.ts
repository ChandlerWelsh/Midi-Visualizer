import { useStore } from '../../store/useStore';
import { midiManager } from '../MidiManager';
import { useEffect } from 'react';

export const useMidi = () => {
    const devices = useStore(state => state.midiDevices);
    const selectedId = useStore(state => state.selectedDeviceId);

    // Initialize MIDI on mount
    useEffect(() => {
        midiManager.init();
    }, []);

    const selectDevice = (id: string) => {
        midiManager.selectInput(id);
    };

    return { devices, selectedId, selectDevice };
};
