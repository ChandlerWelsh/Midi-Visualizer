import * as THREE from 'three';
import type { VisualLayerConfig } from '../types/visuals';
import { ParticleSystem } from './generators/ParticleSystem';
import { ShapeGenerator } from './generators/ShapeGenerator';
import { SpiralGenerator } from './generators/SpiralGenerator';
import { RingsGenerator } from './generators/RingsGenerator';
import { HexGridGenerator } from './generators/HexGridGenerator';
import { CubeFieldGenerator } from './generators/CubeFieldGenerator';
import { WaveformGenerator } from './generators/WaveformGenerator';
import { TerrainGenerator } from './generators/TerrainGenerator';
import { TunnelGenerator } from './generators/TunnelGenerator';
import { PlasmaGenerator } from './generators/PlasmaGenerator';
import { PrismGenerator } from './generators/PrismGenerator';

interface Props {
    config: VisualLayerConfig;
}

export function VisualLayer({ config }: Props) {
    if (!config.enabled) return null;

    const reactivity = config.reactivity ?? 1.0;

    // Map string blend mode to Three.js constant
    let blending: THREE.Blending = THREE.NormalBlending;
    if (config.blendMode === 'add') blending = THREE.AdditiveBlending;
    else if (config.blendMode === 'screen') blending = THREE.CustomBlending; // Three doesn't have explicit Screen?
    // Actually Three.js has Normal, Additive, Subtractive, Multiply.
    // Screen usually requires custom equation. 
    // For simplicity, we can map 'screen' to Additive for now or use Custom.
    // Let's stick to basics:
    if (config.blendMode === 'add') blending = THREE.AdditiveBlending;
    if (config.blendMode === 'multiply') blending = THREE.MultiplyBlending;
    // For 'screen', we technically need CustomBlending with SrcAlpha, One, etc.
    // But let's fallback to Additive for now as it's visually closest to what users want for "glow".
    if (config.blendMode === 'screen') blending = THREE.AdditiveBlending;

    const props = {
        count: config.params.count,
        reactivity: reactivity,
        blending: blending,
        opacity: config.opacity ?? 1.0
    };

    return (
        <group>
            {config.type === 'particles' && (
                <ParticleSystem {...props} />
            )}
            {config.type === 'shapes' && (
                <ShapeGenerator {...props} />
            )}
            {config.type === 'spiral' && (
                <SpiralGenerator {...props} />
            )}
            {config.type === 'rings' && (
                <RingsGenerator {...props} />
            )}
            {config.type === 'hexgrid' && (
                <HexGridGenerator {...props} />
            )}
            {config.type === 'cubefield' && (
                <CubeFieldGenerator {...props} />
            )}
            {config.type === 'waveform' && (
                <WaveformGenerator {...props} />
            )}
            {config.type === 'terrain' && (
                <TerrainGenerator {...props} />
            )}
            {config.type === 'tunnel' && (
                <TunnelGenerator {...props} />
            )}
            {config.type === 'plasma' && (
                <PlasmaGenerator {...props} />
            )}
            {config.type === 'prism' && (
                <PrismGenerator {...props} />
            )}
        </group>
    );
}
