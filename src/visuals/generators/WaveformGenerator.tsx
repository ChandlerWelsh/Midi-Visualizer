import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useInputIntensity } from '../../hooks/useInputIntensity'
import { useStore } from '../../store/useStore'
import { LFO } from '../../modulation/LFO'

interface Props {
    count?: number;
    reactivity?: number;
    blending?: THREE.Blending;
    opacity?: number;
}

export function WaveformGenerator({ count = 100, reactivity = 1.0, blending = THREE.NormalBlending, opacity = 1.0 }: Props) {
    const geometry = useRef<THREE.BufferGeometry>(null)
    const material = useRef<THREE.LineBasicMaterial>(null)
    const getInputIntensity = useInputIntensity();

    const history = useMemo(() => new Float32Array(count).fill(0), [count]);
    const positions = useMemo(() => new Float32Array(count * 3), [count]);

    useFrame((state) => {
        if (!geometry.current) return

        const { intensity } = getInputIntensity(reactivity);
        const { lfos } = useStore.getState();
        const lfo1 = lfos[0] ? LFO.getValue(lfos[0], state.clock.getElapsedTime()) : 0;
        const lfo2 = lfos[1] ? LFO.getValue(lfos[1], state.clock.getElapsedTime()) : 0;

        // Shift history
        for (let i = count - 1; i > 0; i--) {
            history[i] = history[i - 1];
        }
        history[0] = intensity;

        const width = 20 * (1 + lfo2 * 0.5);
        const step = width / count;
        const startX = -width / 2;

        const amp = 5 * (1 + lfo1);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = startX + i * step;
            positions[i * 3 + 1] = history[i] * amp;
            positions[i * 3 + 2] = 0;
        }

        geometry.current.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.current.attributes.position.needsUpdate = true;

        if (material.current) {
            material.current.opacity = opacity;
            material.current.blending = blending;
            material.current.transparent = true;
        }
    })

    return (
        <line>
            <bufferGeometry ref={geometry}>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <lineBasicMaterial ref={material} color="#00ff00" linewidth={2} transparent={true} opacity={opacity} blending={blending} />
        </line>
    )
}
