import type { LfoConfig } from '../types/modulation';

export class LFO {
    static getValue(config: LfoConfig, time: number): number {
        if (!config.enabled) return 0;

        const t = time * config.rate * 2 * Math.PI;
        let value = 0;

        switch (config.shape) {
            case 'sine':
                value = Math.sin(t);
                break;
            case 'triangle':
                value = Math.abs((t / Math.PI) % 2 - 1) * 2 - 1; // Approx
                // Better tri: 2/PI * asin(sin(t))
                value = (2 / Math.PI) * Math.asin(Math.sin(t));
                break;
            case 'square':
                value = Math.sin(t) >= 0 ? 1 : -1;
                break;
            case 'saw':
                value = (t / Math.PI) % 2 - 1;
                // value = - (2 / Math.PI) * atan(cot(t/2))... simple: (t % 2PI) / PI - 1
                value = ((time * config.rate) % 1) * 2 - 1;
                break;
        }

        return value * config.depth;
    }
}
