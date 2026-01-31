import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useInputIntensity } from '../../hooks/useInputIntensity'
import { useStore } from '../../store/useStore'
import { LFO } from '../../modulation/LFO'

interface ShapeGeneratorProps {
    count?: number;
    reactivity?: number;
    blending?: THREE.Blending;
    opacity?: number;
}

export function ShapeGenerator({ count = 500, reactivity = 1.0, blending = THREE.NormalBlending, opacity = 1.0 }: ShapeGeneratorProps) {
    const mesh = useRef<THREE.InstancedMesh>(null)
    const dummy = useMemo(() => new THREE.Object3D(), [])
    const getInputIntensity = useInputIntensity();

    const particles = useMemo(() => {
        const temp = []
        const gridSize = Math.ceil(Math.pow(count, 1 / 3));
        const spacing = 1.5;
        const offset = (gridSize * spacing) / 2;

        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                for (let z = 0; z < gridSize; z++) {
                    if (temp.length >= count) break;
                    temp.push({
                        baseX: x * spacing - offset,
                        baseY: y * spacing - offset,
                        baseZ: z * spacing - offset,
                        rotationSpeed: (Math.random() - 0.5) * 0.02,
                        phase: Math.random() * Math.PI * 2
                    })
                }
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
        const lfo2 = lfos[1] ? LFO.getValue(lfos[1], state.clock.getElapsedTime()) : 0;

        dataRef.current.intensity += (target - dataRef.current.intensity) * 0.15;
        const intensity = dataRef.current.intensity;
        const time = state.clock.getElapsedTime();

        particles.forEach((p, i) => {
            const rotSpeed = p.rotationSpeed * (1 + intensity * 5);

            dummy.position.set(
                p.baseX + Math.sin(time + p.phase) * (intensity * 0.5),
                p.baseY + Math.cos(time * 0.5 + p.phase) * (lfo1 * 2),
                p.baseZ
            );

            dummy.rotation.x += rotSpeed;
            dummy.rotation.y += rotSpeed;
            dummy.rotation.z = Math.sin(time + p.phase) * intensity;

            const scaleBase = 0.5 + (lfo2 * 0.3);
            const scale = scaleBase + (intensity * 0.8 * reactivity);

            dummy.scale.setScalar(scale);
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
            <octahedronGeometry args={[0.5, 0]} />
            <meshStandardMaterial
                color="#ff0055"
                wireframe={true}
                emissive="#ff0055"
                emissiveIntensity={0.5}
                transparent={true}
                opacity={opacity}
                blending={blending}
            />
        </instancedMesh>
    )
}
