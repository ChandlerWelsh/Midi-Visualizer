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

export function RingsGenerator({ count = 2000, reactivity = 1.0, blending = THREE.NormalBlending, opacity = 1.0 }: Props) {
    const mesh = useRef<THREE.InstancedMesh>(null)
    const dummy = useMemo(() => new THREE.Object3D(), [])
    const getInputIntensity = useInputIntensity();

    const particles = useMemo(() => {
        const temp = []
        const numRings = 20;
        const particlesPerRing = Math.floor(count / numRings);

        for (let r = 0; r < numRings; r++) {
            for (let i = 0; i < particlesPerRing; i++) {
                const angle = (i / particlesPerRing) * Math.PI * 2;
                temp.push({
                    ringId: r,
                    angle: angle,
                    baseRadius: 0,
                    speed: 0.02 + (Math.random() * 0.01),
                    noise: Math.random()
                })
            }
        }
        return temp
    }, [count])

    const dataRef = useRef({ intensity: 0, ringOffset: 0 })

    useFrame((state) => {
        if (!mesh.current) return

        const { intensity: totalIntensity, bass } = getInputIntensity(reactivity);
        const { lfos } = useStore.getState();
        const lfo1 = lfos[0] ? LFO.getValue(lfos[0], state.clock.getElapsedTime()) : 0;
        const lfo2 = lfos[1] ? LFO.getValue(lfos[1], state.clock.getElapsedTime()) : 0;

        const target = totalIntensity + (bass * 2);

        dataRef.current.intensity += (target - dataRef.current.intensity) * 0.2;
        const intensity = dataRef.current.intensity;
        const time = state.clock.getElapsedTime();

        if (intensity > 0.5) dataRef.current.ringOffset += intensity * 0.05;

        const flow = time * 0.5 + dataRef.current.ringOffset;

        particles.forEach((p, i) => {
            const ringPos = (p.ringId + flow) % 20;
            const radius = ringPos * 1.5;

            const wobble = Math.sin(p.angle * 5 + time + p.noise) * (intensity + lfo1);
            const rotate = time * (0.1 + (p.ringId % 2 === 0 ? 0.1 : -0.1));

            dummy.position.x = (radius + wobble) * Math.cos(p.angle + rotate);
            dummy.position.y = (radius + wobble) * Math.sin(p.angle + rotate);
            dummy.position.z = Math.sin(radius * 0.5 - time) * (1 + intensity * 2);

            const alpha = 1 - (ringPos / 20);
            const scale = alpha * (0.5 + intensity + (lfo2 * 0.5));

            dummy.scale.setScalar(scale > 0 ? scale : 0);
            dummy.lookAt(0, 0, 0);
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
            <boxGeometry args={[0.2, 0.05, 0.1]} />
            <meshStandardMaterial
                color="#00ccff"
                emissive="#0044aa"
                emissiveIntensity={0.8}
                transparent={true}
                opacity={opacity}
                blending={blending}
            />
        </instancedMesh>
    )
}
