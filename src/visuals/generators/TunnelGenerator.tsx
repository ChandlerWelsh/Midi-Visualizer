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

export function TunnelGenerator({ count = 64, reactivity = 1.0, blending = THREE.NormalBlending, opacity = 1.0 }: Props) {
    const mesh = useRef<THREE.Mesh>(null)
    const getInputIntensity = useInputIntensity();

    const segments = Math.min(Math.max(64, count), 256);

    const path = useMemo(() => {
        const points = []
        for (let i = 0; i < 50; i++) {
            points.push(new THREE.Vector3(
                Math.sin(i * 0.5) * 5,
                Math.cos(i * 0.3) * 5,
                i * -2
            ))
        }
        return new THREE.CatmullRomCurve3(points)
    }, [])

    const dataRef = useRef({ offset: 0, speed: 0.02 })

    useFrame((state) => {
        if (!mesh.current) return

        const { intensity } = getInputIntensity(reactivity);
        const { lfos } = useStore.getState();
        const lfo1 = lfos[0] ? LFO.getValue(lfos[0], state.clock.getElapsedTime()) : 0;
        const lfo2 = lfos[1] ? LFO.getValue(lfos[1], state.clock.getElapsedTime()) : 0;

        dataRef.current.speed = 0.02 + (intensity * 0.05) + (lfo2 * 0.05);
        dataRef.current.offset += dataRef.current.speed;

        mesh.current.rotation.z += 0.01 * intensity;

        const scale = 1 + (Math.sin(state.clock.elapsedTime * 10) * 0.05 * intensity) + (lfo1 * 0.3);
        mesh.current.scale.setScalar(scale);

        const mat = mesh.current.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 0.5 + (intensity * 0.5);
        mat.opacity = opacity;
        mat.blending = blending;
        mat.transparent = true;
    })

    return (
        <mesh ref={mesh} position={[0, 0, 0]}>
            <tubeGeometry args={[path, segments, 2, 8, false]} />
            <meshStandardMaterial
                color="#000"
                emissive="#00ffff"
                wireframe={true}
                side={THREE.DoubleSide}
                transparent={true}
                opacity={opacity}
                blending={blending}
            />
        </mesh>
    )
}
