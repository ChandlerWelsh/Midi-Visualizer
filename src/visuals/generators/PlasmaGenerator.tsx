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

const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    uniform float iTime;
    uniform float iIntensity;
    uniform float iOpacity;
    varying vec2 vUv;

    void main() {
        vec2 p = vUv * 2.0 - 1.0;
        
        float t = iTime * (1.0 + iIntensity);
        
        float v = sin(p.x * 10.0 + t);
        v += sin(p.y * 10.0 + t);
        v += sin((p.x + p.y) * 10.0 + t);
        v += cos(sqrt(p.x*p.x + p.y*p.y) * 10.0 + t);
        
        float r = sin(v * 2.0 + t) * 0.5 + 0.5;
        float g = sin(v * 2.0 + t + 2.0) * 0.5 + 0.5;
        float b = sin(v * 2.0 + t + 4.0) * 0.5 + 0.5;
        
        vec3 col = vec3(r, g, b) * (1.0 + iIntensity);
        
        gl_FragColor = vec4(col, iOpacity);
    }
`;

export function PlasmaGenerator({ count = 1, reactivity = 1.0, blending = THREE.NormalBlending, opacity = 1.0 }: Props) {
    const mesh = useRef<THREE.Mesh>(null)
    const getInputIntensity = useInputIntensity();

    // Shader doesn't need high geo count unless we displace vertices.
    const segments = Math.min(Math.max(1, count), 64);

    const uniforms = useMemo(() => ({
        iTime: { value: 0 },
        iIntensity: { value: 0 },
        iOpacity: { value: 1.0 }
    }), [])

    useFrame((state) => {
        if (!mesh.current) return

        const { intensity, treble } = getInputIntensity(reactivity);
        const { lfos } = useStore.getState();
        const lfo1 = lfos[0] ? LFO.getValue(lfos[0], state.clock.getElapsedTime()) : 0;
        const lfo2 = lfos[1] ? LFO.getValue(lfos[1], state.clock.getElapsedTime()) : 0;

        const finalIntensity = intensity + (treble * 0.5) + (lfo2 * 0.5);

        uniforms.iTime.value = state.clock.getElapsedTime() * (1 + lfo1);
        uniforms.iIntensity.value = finalIntensity;
        uniforms.iOpacity.value = opacity;

        const mat = mesh.current.material as THREE.ShaderMaterial;
        mat.blending = blending;
        mat.transparent = true;
    })

    return (
        <mesh ref={mesh}>
            <planeGeometry args={[15, 15, segments, segments]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent={true}
                blending={blending}
            />
        </mesh>
    )
}
