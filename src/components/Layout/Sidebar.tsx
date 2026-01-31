import { LayerPanel } from '../Controls/LayerPanel';
import { ModulationPanel } from '../Controls/ModulationPanel';
import { MappingPanel } from '../Controls/MappingPanel';

export function Sidebar() {
    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <LayerPanel />
                <ModulationPanel />
                <MappingPanel />
            </div>
        </>
    );
}
