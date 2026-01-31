import { useRef } from 'react'
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

function noise(x: number, y: number) {
    return Math.sin(x) * Math.cos(y);
}

export function TerrainGenerator({ count = 32, reactivity = 1.0, blending = THREE.NormalBlending, opacity = 1.0 }: Props) {
    const mesh = useRef<THREE.Mesh>(null)
    const getInputIntensity = useInputIntensity();

    const segments = Math.min(Math.max(32, count), 128);

    useFrame((state) => {
        if (!mesh.current) return

        const geometry = mesh.current.geometry;
        const positions = geometry.attributes.position;
        const time = state.clock.getElapsedTime();

        const { intensity } = getInputIntensity(reactivity);
        const { lfos } = useStore.getState();
        const lfo1 = lfos[0] ? LFO.getValue(lfos[0], time) : 0;
        const lfo2 = lfos[1] ? LFO.getValue(lfos[1], time) : 0;

        const boost = intensity > 0 ? (1 + intensity * 0.5) : 1;
        const heightScale = 2 * (1 + lfo1);
        const scrollSpeed = 0.5 * (1 + lfo2 * 2);

        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);

            const z = noise(x * 0.2, (y * 0.2) + (time * scrollSpeed)) * heightScale * boost;
            const spike = intensity > 0.1 ? (Math.random() * 0.5 * intensity) : 0;

            positions.setZ(i, z + spike);
        }

        positions.needsUpdate = true;
        geometry.computeVertexNormals();

        const mat = mesh.current.material as THREE.MeshStandardMaterial;
        mat.opacity = opacity;
        mat.blending = blending;
        mat.transparent = true;
    })

    return (
        <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
            <planeGeometry args={[20, 20, segments, segments]} />
            <meshStandardMaterial
                color="#555"
                wireframe={true}
                emissive="#aa0000"
                emissiveIntensity={0.2 + (0.5 * reactivity)}
                transparent={true}
                opacity={opacity}
                blending={blending}
            />
        </mesh>
    )
}
