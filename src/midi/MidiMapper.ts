import type { MidiMessage } from '../types/midi';
import { useStore } from '../store/useStore';

export class MidiMapper {
    private static instance: MidiMapper;

    static getInstance(): MidiMapper {
        if (!MidiMapper.instance) {
            MidiMapper.instance = new MidiMapper();
        }
        return MidiMapper.instance;
    }

    processMessage(msg: MidiMessage) {
        if (msg.type !== 'cc') return; // Only map CCs for now

        const store = useStore.getState();

        // 1. Check Learning Mode
        if (store.learningState.isActive && store.learningState.targetId && store.learningState.paramPath) {
            console.log('Learning mapping for:', store.learningState.paramPath);
            store.addMapping({
                id: crypto.randomUUID(),
                source: { channel: msg.channel, cc: msg.data1 },
                target: {
                    targetId: store.learningState.targetId,
                    paramPath: store.learningState.paramPath,
                    type: store.learningState.targetType as 'layer' | 'lfo'
                }
            });
            return;
        }

        // 2. Process Mappings
        const mappings = store.mappings.filter(
            m => m.source.channel === msg.channel && m.source.cc === msg.data1
        );

        mappings.forEach(mapping => {
            const normalized = msg.data2 / 127; // 0 to 1

            if (mapping.target.type === 'layer') {
                const layer = store.layers.find(l => l.id === mapping.target.targetId);
                if (!layer) return;

                if (mapping.target.paramPath === 'opacity') {
                    store.updateLayer(layer.id, { opacity: normalized });
                } else if (mapping.target.paramPath === 'reactivity') {
                    store.updateLayer(layer.id, { reactivity: normalized * 2 }); // Scale 0-2
                } else if (mapping.target.paramPath === 'params.count') {
                    // Assume count range 100-5000
                    const count = 100 + Math.floor(normalized * 4900);
                    store.updateLayer(layer.id, { params: { ...layer.params, count } });
                }
            } else if (mapping.target.type === 'lfo') {
                const lfo = store.lfos.find(l => l.id === mapping.target.targetId);
                if (!lfo) return;

                if (mapping.target.paramPath === 'rate') {
                    store.updateLfo(lfo.id, { rate: 0.1 + normalized * 10 }); // 0.1 - 10Hz
                } else if (mapping.target.paramPath === 'depth') {
                    store.updateLfo(lfo.id, { depth: normalized });
                }
            }
        });
    }
}

export const midiMapper = MidiMapper.getInstance();
