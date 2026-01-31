import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { VisualLayer } from '../../visuals/VisualLayer';
import { useStore } from '../../store/useStore';

export function VisualCanvas() {
    const layers = useStore((state) => state.layers);

    // Performance: Limit pixel ratio
    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1;

    return (
        <div style={{ width: '100%', height: '100%', background: '#000' }}>
            <Canvas
                dpr={dpr}
                camera={{ position: [0, 0, 15], fov: 60 }}
                gl={{ antialias: true, powerPreference: 'high-performance' }}
            >
                <color attach="background" args={['#050510']} />

                {/* Lighting to ensure visibility */}
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4400ff" />

                <group>
                    {layers.map((layer) => (
                        <VisualLayer key={layer.id} config={layer} />
                    ))}
                </group>

                <OrbitControls makeDefault />
            </Canvas>
        </div>
    );
}
