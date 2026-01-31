import { useStore } from '../store/useStore';
import type { MidiMessage, MidiDevice } from '../types/midi';
import { midiMapper } from './MidiMapper';

export class MidiManager {
    private static instance: MidiManager;
    private access: MIDIAccess | null = null;
    private listeners: Set<(msg: MidiMessage) => void> = new Set();
    private activeInput: MIDIInput | null = null;

    private constructor() { }

    static getInstance(): MidiManager {
        if (!MidiManager.instance) {
            MidiManager.instance = new MidiManager();
        }
        return MidiManager.instance;
    }

    // Track active notes for polling in render loop (avoid React state)
    // Key: "channel-note", Value: velocity (0-1)
    private activeNotes: Map<string, number> = new Map();

    getActiveNotes(): Map<string, number> {
        return this.activeNotes;
    }

    async init() {
        try {
            if (!navigator.requestMIDIAccess) {
                console.error('Web MIDI API not supported');
                return;
            }

            this.access = await navigator.requestMIDIAccess();
            this.updateDevices();

            this.access.onstatechange = () => {
                this.updateDevices();
            };

        } catch (err) {
            console.error('MIDI Access failed', err);
        }
    }

    private updateDevices() {
        if (!this.access) return;

        const inputs: MidiDevice[] = [];
        // MIDIInputMap has forEach(callback(value, key))
        this.access.inputs.forEach((input) => {
            inputs.push({
                id: input.id,
                name: input.name || `MIDI Device ${input.id}`,
                manufacturer: input.manufacturer || '',
                state: input.state,
                connection: input.connection
            });
        });

        useStore.getState().setMidiDevices(inputs);

        // Auto-reconnect if selected
        const selectedId = useStore.getState().selectedDeviceId;
        if (selectedId && (!this.activeInput || this.activeInput.id !== selectedId)) {
            this.selectInput(selectedId);
        }
    }

    selectInput(id: string) {
        if (!this.access) return;

        // Disconnect previous
        if (this.activeInput) {
            this.activeInput.onmidimessage = null;
        }

        const input = this.access.inputs.get(id);
        if (input) {
            this.activeInput = input;
            input.onmidimessage = this.handleMidiMessage.bind(this);
            useStore.getState().setSelectedDeviceId(id);
            console.log(`Connected to MIDI: ${input.name}`);
        }
    }

    private handleMidiMessage(event: MIDIMessageEvent) {
        if (!event.data) return;
        const status = event.data[0];
        const data1 = event.data[1];
        const data2 = event.data[2];
        const command = status >> 4;
        const channel = status & 0xf;

        let type: MidiMessage['type'] = 'unknown';

        // Note On (sometimes note off is note on with velocity 0)
        if (command === 0x9 && data2 > 0) {
            type = 'note_on';
            this.activeNotes.set(`${channel}-${data1}`, data2 / 127);
        } else if (command === 0x8 || (command === 0x9 && data2 === 0)) {
            type = 'note_off';
            this.activeNotes.delete(`${channel}-${data1}`);
        } else if (command === 0xB) {
            type = 'cc';
        } else if (command === 0xE) {
            type = 'pitch_bend';
        }

        if (type !== 'unknown') {
            const msg: MidiMessage = {
                type,
                channel,
                data1, // note or cc
                data2, // velocity or value
                deviceId: (event.target as any).id,
                timestamp: event.timeStamp
            };

            midiMapper.processMessage(msg);

            this.listeners.forEach(listener => listener(msg));
        }
    }

    addListener(callback: (msg: MidiMessage) => void) {
        this.listeners.add(callback);
        return () => {
            this.listeners.delete(callback);
        };
    }
}

export const midiManager = MidiManager.getInstance();
