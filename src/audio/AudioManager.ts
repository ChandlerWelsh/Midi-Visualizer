

export interface AudioAnalysis {
    bass: number;
    mid: number;
    treble: number;
    volume: number;
}

export class AudioManager {
    private static instance: AudioManager;
    private context: AudioContext | null = null;
    private analyser: AnalyserNode | null = null;
    private source: MediaStreamAudioSourceNode | null = null;
    private dataArray: Uint8Array | null = null;

    private constructor() { }

    static getInstance(): AudioManager {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }

    async init() {
        if (this.context) return;

        try {
            this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
            this.analyser = this.context.createAnalyser();
            this.analyser.fftSize = 512;
            this.analyser.smoothingTimeConstant = 0.8;

            this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

            // Get Mic
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.source = this.context.createMediaStreamSource(stream);
            this.source.connect(this.analyser);

            console.log('Audio Manager Initialized');
        } catch (err) {
            console.error('Audio Init Failed', err);
        }
    }

    getAnalysis(): AudioAnalysis {
        if (!this.analyser || !this.dataArray) {
            return { bass: 0, mid: 0, treble: 0, volume: 0 };
        }

        this.analyser.getByteFrequencyData(this.dataArray as any);

        // Simple frequency bands
        // 512 FFT size = 256 bins.
        // Sample rate 44100 -> nyquist 22050.
        // bin size ~86Hz.

        let bassSum = 0, midSum = 0, trebleSum = 0;

        // Bass: 0-4 (0-344Hz)
        for (let i = 0; i < 4; i++) bassSum += this.dataArray[i];

        // Mid: 4-30 (344-2500Hz)
        for (let i = 4; i < 30; i++) midSum += this.dataArray[i];

        // Treble: 30-100 (2500-8600Hz)
        for (let i = 30; i < 100; i++) trebleSum += this.dataArray[i];

        return {
            bass: bassSum / (4 * 255),
            mid: midSum / (26 * 255),
            treble: trebleSum / (70 * 255),
            volume: (bassSum + midSum + trebleSum) / (100 * 255)
        };
    }
}

export const audioManager = AudioManager.getInstance();
