export type MidiMessageType = 'note_on' | 'note_off' | 'cc' | 'pitch_bend' | 'unknown';

export interface MidiMessage {
    type: MidiMessageType;
    channel: number;
    data1: number; // note or cc number
    data2: number; // velocity or value
    deviceId: string;
    timestamp: number;
}

export interface MidiDevice {
    id: string;
    name: string;
    manufacturer: string;
    state: string; // connected, disconnected
    connection: string; // open, closed, pending
}

export type MidiEventHandler = (event: MidiMessage) => void;
