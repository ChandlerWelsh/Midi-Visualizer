import React from 'react';
import { useStore } from '../../store/useStore';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    // MIDI Learn Props
    learnId?: string; // Unique ID for this param (e.g. layer-1-opacity)
    paramPath?: string; // param path for mapping logic
    targetType?: 'layer' | 'lfo';
}

export function Slider({ label, value, onChange, learnId, paramPath, targetType, ...props }: Props) {
    const learningState = useStore(s => s.learningState);
    const setLearningTarget = useStore(s => s.setLearningTarget);

    // Is this specific slider being learned?
    const isTargeted = learningState.targetId === learnId && learningState.paramPath === paramPath;

    // Is global learning active?
    // We can show a visual cue that this is "learnable"

    const handleLearnClick = (e: React.MouseEvent) => {
        if (e.altKey || learningState.isActive) {
            e.preventDefault();
            if (learnId && paramPath && targetType) {
                setLearningTarget(targetType, learnId, paramPath);
            }
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {label && (
                    <label style={{ fontSize: '0.75rem', color: isTargeted ? '#00ff88' : 'rgba(255,255,255,0.6)' }}>
                        {label} {isTargeted && '(Turn Knob)'}
                    </label>
                )}
            </div>

            <div style={{ position: 'relative' }}>
                <input
                    type="range"
                    value={value}
                    onChange={onChange}
                    onClick={handleLearnClick}
                    style={{
                        width: '100%',
                        cursor: 'pointer',
                        accentColor: isTargeted ? '#ff0055' : '#00ff88',
                        opacity: (learningState.isActive && !isTargeted) ? 0.5 : 1
                    }}
                    {...props}
                />
                {learningState.isActive && !isTargeted && (
                    <div
                        onClick={handleLearnClick}
                        style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            cursor: 'crosshair',
                            zIndex: 10
                        }}
                        title="Click to map MIDI"
                    />
                )}
            </div>
        </div>
    );
}
