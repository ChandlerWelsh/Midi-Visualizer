import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useInputIntensity } from '../../hooks/useInputIntensity'
import { useStore } from '../../store/useStore'
import { LFO } from '../../modulation/LFO'

interface ParticleSystemProps {
    count?: number;
    reactivity?: number;
    blending?: THREE.Blending;
    opacity?: number;
}

export function ParticleSystem({ count = 1000, reactivity = 1.0, blending = THREE.NormalBlending, opacity = 1.0 }: ParticleSystemProps) {
    const mesh = useRef<THREE.InstancedMesh>(null)
    const dummy = useMemo(() => new THREE.Object3D(), [])
    const getInputIntensity = useInputIntensity();

    // Initial random positions
    const particles = useMemo(() => {
        const temp = []
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100
            const factor = 20 + Math.random() * 100
            const speed = 0.01 + Math.random() / 200
            const xFactor = -50 + Math.random() * 100
            const yFactor = -50 + Math.random() * 100
            const zFactor = -50 + Math.random() * 100
            temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 })
        }
        return temp
    }, [count])

    useFrame((state) => {
        if (!mesh.current) return

        const { intensity } = getInputIntensity(reactivity);
        const { lfos } = useStore.getState();
        const lfo1 = lfos[0] ? LFO.getValue(lfos[0], state.clock.getElapsedTime()) : 0;
        const lfo2 = lfos[1] ? LFO.getValue(lfos[1], state.clock.getElapsedTime()) : 0;

        particles.forEach((particle, i) => {
            let { t, factor, speed, xFactor, yFactor, zFactor } = particle

            t = particle.t += speed / 2 + (intensity * speed * 20);

            const a = Math.cos(t) + Math.sin(t * 1) / 10
            const b = Math.sin(t) + Math.cos(t * 2) / 10
            const s = Math.cos(t)

            const radiusMod = 1 + lfo1;

            dummy.position.set(
                (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10 * radiusMod,
                (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10 * radiusMod,
                (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10 * radiusMod
            )

            const scale = (s * 5) + (lfo2 * 2) + (intensity * 5);
            const clampedScale = Math.max(0, scale);

            dummy.scale.set(clampedScale, clampedScale, clampedScale)
            dummy.rotation.set(s * 5, s * 5, s * 5)
            dummy.updateMatrix()

            mesh.current!.setMatrixAt(i, dummy.matrix)
        })
        mesh.current.instanceMatrix.needsUpdate = true

        // Update material props dynamically
        const mat = mesh.current.material as THREE.MeshStandardMaterial;
        mat.opacity = opacity;
        mat.blending = blending;
        mat.transparent = true;
    })

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
            <sphereGeometry args={[0.05, 10, 10]} />
            <meshStandardMaterial
                color="#00ff88"
                emissive="#00ff88"
                emissiveIntensity={0.5}
                roughness={0.5}
                metalness={0.5}
                transparent={true}
                opacity={opacity}
                blending={blending}
            />
        </instancedMesh>
    )
}
