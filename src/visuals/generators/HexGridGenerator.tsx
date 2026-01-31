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

export function HexGridGenerator({ count = 1000, reactivity = 1.0, blending = THREE.NormalBlending, opacity = 1.0 }: Props) {
    const mesh = useRef<THREE.InstancedMesh>(null)
    const dummy = useMemo(() => new THREE.Object3D(), [])
    const getInputIntensity = useInputIntensity();

    const particles = useMemo(() => {
        const temp = []
        const gridSize = Math.floor(Math.sqrt(count));
        const spacing = 1.0;

        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                const xPos = (x + (y % 2) * 0.5) * spacing * 1.5;
                const yPos = y * spacing * Math.sqrt(3) * 0.5;

                const centerX = (gridSize * spacing * 1.5) / 2;
                const centerY = (gridSize * spacing * Math.sqrt(3) * 0.5) / 2;

                temp.push({
                    x: xPos - centerX,
                    y: yPos - centerY,
                    z: 0,
                    id: x + y * gridSize,
                    phase: (x * 0.1) + (y * 0.1)
                })
            }
        }
        return temp
    }, [count])

    const dataRef = useRef({ intensity: 0 })

    useFrame((state) => {
        if (!mesh.current) return

        const { intensity: target } = getInputIntensity(reactivity);
        const { lfos } = useStore.getState();
        const lfo1 = lfos[0] ? LFO.getValue(lfos[0], state.clock.getElapsedTime()) : 0;

        dataRef.current.intensity += (target - dataRef.current.intensity) * 0.1;
        const intensity = dataRef.current.intensity;
        const time = state.clock.getElapsedTime();

        particles.forEach((p, i) => {
            const wave = Math.sin(p.x * 0.5 + time + p.phase) + Math.cos(p.y * 0.5 + time * 1.5);
            const height = Math.max(0.1, (wave * 2) + (intensity * 4) + (lfo1 * 2));

            dummy.position.set(p.x, wave * 0.5, p.y);
            dummy.scale.set(1, height, 1);
            dummy.rotation.set(0, 0, 0);

            dummy.updateMatrix()
            mesh.current!.setMatrixAt(i, dummy.matrix)
        })
        mesh.current.instanceMatrix.needsUpdate = true

        const mat = mesh.current.material as THREE.MeshStandardMaterial;
        mat.opacity = opacity;
        mat.blending = blending;
        mat.transparent = true;
    })

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
            <cylinderGeometry args={[0.4, 0.4, 1, 6]} />
            <meshStandardMaterial
                color="#222"
                emissive="#00ff00"
                emissiveIntensity={0.2}
                roughness={0.2}
                metalness={0.8}
                transparent={true}
                opacity={opacity}
                blending={blending}
            />
        </instancedMesh>
    )
}
