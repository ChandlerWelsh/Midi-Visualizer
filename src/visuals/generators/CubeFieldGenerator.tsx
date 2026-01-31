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

export function CubeFieldGenerator({ count = 1000, reactivity = 1.0, blending = THREE.NormalBlending, opacity = 1.0 }: Props) {
    const mesh = useRef<THREE.InstancedMesh>(null)
    const dummy = useMemo(() => new THREE.Object3D(), [])
    const getInputIntensity = useInputIntensity();

    const particles = useMemo(() => {
        const temp = []
        const gridSize = Math.ceil(Math.pow(count, 1 / 3));
        const spacing = 2.0;
        const offset = (gridSize * spacing) / 2;

        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                for (let z = 0; z < gridSize; z++) {
                    if (temp.length >= count) break;
                    temp.push({
                        baseX: x * spacing - offset,
                        baseY: y * spacing - offset,
                        baseZ: z * spacing - offset,
                        veloY: 0,
                        currentY: y * spacing - offset,
                        phase: Math.random() * Math.PI * 2
                    })
                }
            }
        }
        return temp
    }, [count])

    useFrame((state) => {
        if (!mesh.current) return

        const { intensity } = getInputIntensity(reactivity);
        const { lfos } = useStore.getState();
        const lfo1 = lfos[0] ? LFO.getValue(lfos[0], state.clock.getElapsedTime()) : 0;
        const lfo2 = lfos[1] ? LFO.getValue(lfos[1], state.clock.getElapsedTime()) : 0;

        // Lower threshold for activation (0.01 instead of 0.1)
        // Jump probability increases with intensity
        let jumpForce = 0;
        let jumpProb = 0.0;

        if (intensity > 0.01) {
            jumpForce = 0.8 * intensity * (1 + lfo1);
            jumpProb = 0.02 + (intensity * 0.4);
        }

        const time = state.clock.getElapsedTime();

        particles.forEach((p, i) => {
            // Trigger jump
            if (jumpForce > 0 && Math.random() < jumpProb) {
                p.veloY += jumpForce * (Math.random() + 0.5);
            }

            // Gravity
            const gravity = 0.02 * (1 - (lfo2 * 0.5));
            p.veloY -= gravity;
            p.currentY += p.veloY;

            // Idle Hover (breathing effect)
            let idleY = 0;
            if (Math.abs(p.currentY - p.baseY) < 0.1) {
                idleY = Math.sin(time + p.phase) * 0.2;
            }

            // Floor collision
            if (p.currentY < p.baseY) {
                p.currentY = p.baseY;
                p.veloY *= -0.4;
                if (Math.abs(p.veloY) < 0.01) p.veloY = 0;
            }

            const finalY = p.currentY + idleY;

            dummy.position.set(p.baseX, finalY, p.baseZ);

            // Stretch
            const stretch = 1 + Math.abs(p.veloY) * 2;
            dummy.scale.set(1, stretch, 1);

            dummy.rotation.x = (p.veloY * 0.5) + (idleY * 0.5);
            dummy.rotation.y = (p.veloY * 0.2) + (time * 0.1);

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
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial
                color="#8800ff"
                emissive="#4400aa"
                emissiveIntensity={0.4}
                roughness={0.3}
                metalness={0.6}
                transparent={true} // Crucial for blending
                opacity={opacity}
                blending={blending}
            />
        </instancedMesh>
    )
}
