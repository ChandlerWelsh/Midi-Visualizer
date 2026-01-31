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

export function PrismGenerator({ count = 50, reactivity = 1.0, blending = THREE.NormalBlending, opacity = 1.0 }: Props) {
    const mainMesh = useRef<THREE.Mesh>(null)
    const shardsMesh = useRef<THREE.InstancedMesh>(null)
    const dummy = useMemo(() => new THREE.Object3D(), [])
    const getInputIntensity = useInputIntensity();

    const shards = useMemo(() => {
        const temp = []
        for (let i = 0; i < count; i++) {
            temp.push({
                radius: 3 + Math.random() * 5,
                theta: Math.random() * Math.PI * 2,
                phi: Math.random() * Math.PI,
                speed: (Math.random() - 0.5) * 0.02
            })
        }
        return temp
    }, [count])

    useFrame((state) => {
        if (!mainMesh.current) return

        const { intensity } = getInputIntensity(reactivity);
        const { lfos } = useStore.getState();
        const lfo1 = lfos[0] ? LFO.getValue(lfos[0], state.clock.getElapsedTime()) : 0;
        const lfo2 = lfos[1] ? LFO.getValue(lfos[1], state.clock.getElapsedTime()) : 0;

        const time = state.clock.getElapsedTime();

        // LFO1 modulates rotation speed
        mainMesh.current.rotation.x = time * 0.2 * (1 + lfo1);
        mainMesh.current.rotation.y = time * 0.3 * (1 + lfo1);

        const mat = mainMesh.current.material as THREE.MeshPhysicalMaterial;
        mat.emissiveIntensity = intensity;
        mat.opacity = opacity;
        mat.blending = blending;
        mat.transparent = true;

        if (shardsMesh.current) {
            shards.forEach((s, i) => {
                s.theta += s.speed * (1 + intensity);

                const r = s.radius * (1 + lfo2 * 0.3);

                dummy.position.setFromSphericalCoords(r, s.phi, s.theta);
                dummy.lookAt(0, 0, 0);
                dummy.rotateZ(time + i);

                const scale = 0.2 + (Math.sin(time + i) * 0.1) + intensity * 0.2;
                dummy.scale.setScalar(scale);

                dummy.updateMatrix()
                shardsMesh.current!.setMatrixAt(i, dummy.matrix)
            })
            shardsMesh.current.instanceMatrix.needsUpdate = true

            const shardMat = shardsMesh.current.material as THREE.MeshPhysicalMaterial;
            shardMat.opacity = opacity * 0.6; // Slightly more transparent than main
            shardMat.blending = blending;
            shardMat.transparent = true;
        }
    })

    return (
        <group>
            {/* Main Crystal */}
            <mesh ref={mainMesh}>
                <icosahedronGeometry args={[2, 0]} />
                <meshPhysicalMaterial
                    color="#ffffff"
                    emissive="#ff00ff"
                    emissiveIntensity={0}
                    transmission={0.9}
                    opacity={opacity}
                    metalness={0}
                    roughness={0}
                    ior={1.5}
                    thickness={2}
                    transparent={true}
                    blending={blending}
                />
            </mesh>

            {/* Floating Shards */}
            <instancedMesh ref={shardsMesh} args={[undefined, undefined, count]}>
                <octahedronGeometry args={[0.5, 0]} />
                <meshPhysicalMaterial
                    color="#00ffff"
                    emissive="#00ffff"
                    emissiveIntensity={0.5}
                    transmission={0.6}
                    roughness={0.2}
                    transparent={true}
                    opacity={opacity}
                    blending={blending}
                />
            </instancedMesh>
        </group>
    )
}
