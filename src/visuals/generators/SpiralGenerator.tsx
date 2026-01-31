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

export function SpiralGenerator({ count = 2000, reactivity = 1.0, blending = THREE.NormalBlending, opacity = 1.0 }: Props) {
    const mesh = useRef<THREE.InstancedMesh>(null)
    const dummy = useMemo(() => new THREE.Object3D(), [])
    const getInputIntensity = useInputIntensity();

    const particles = useMemo(() => {
        const temp = []
        const phi = 137.5 * (Math.PI / 180);

        for (let i = 0; i < count; i++) {
            const angle = i * phi;
            const radius = 0.5 * Math.sqrt(i);

            temp.push({
                angle,
                baseRadius: radius,
                y: 0,
                speed: (Math.random() - 0.5) * 0.05,
                phase: Math.random() * Math.PI * 2
            })
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

        mesh.current.rotation.z += 0.002 + (intensity * 0.01);

        particles.forEach((p, i) => {
            const currentRadius = p.baseRadius * (1 + lfo1 * 0.2) + (intensity * 5 * reactivity);
            const twist = p.angle + (time * 0.1);

            dummy.position.x = currentRadius * Math.cos(twist);
            dummy.position.y = currentRadius * Math.sin(twist);
            dummy.position.z = Math.sin(currentRadius * 0.5 - time * 2) * (2 + intensity * 5);

            const scale = (0.5 + intensity) * (1 - (i / count));
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
            <sphereGeometry args={[0.1, 10, 10]} />
            <meshStandardMaterial
                color="#00ff88"
                emissive="#00ff88"
                emissiveIntensity={0.5}
                transparent={true}
                opacity={opacity}
                blending={blending}
            />
        </instancedMesh>
    )
}
