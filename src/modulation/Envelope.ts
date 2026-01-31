import type { EnvelopeConfig } from '../types/modulation';

export class Envelope {
    // ADSR calculation based on trigger time and release time
    // Returns 0-1 value
    static getValue(
        config: EnvelopeConfig,
        time: number,
        triggerTime: number,
        releaseTime: number | null
    ): number {
        if (!config.enabled) return 0;

        // Attack
        const timeSinceTrigger = time - triggerTime;
        if (timeSinceTrigger < 0) return 0;

        if (timeSinceTrigger < config.attack) {
            return timeSinceTrigger / config.attack;
        }

        // Decay
        const timeSincePeak = timeSinceTrigger - config.attack;
        if (timeSincePeak < config.decay) {
            return 1 - (timeSincePeak / config.decay) * (1 - config.sustain);
        }

        // Sustain
        if (releaseTime === null) {
            return config.sustain;
        }

        // Release
        const timeSinceRelease = time - releaseTime;
        if (timeSinceRelease < 0) return config.sustain; // Should be impossible if releaseTime set correctly

        if (timeSinceRelease < config.release) {
            return config.sustain * (1 - timeSinceRelease / config.release);
        }

        return 0;
    }
}
