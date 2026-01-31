import type { ReactNode } from 'react';

interface AppShellProps {
    header: ReactNode;
    sidebar: ReactNode;
    children: ReactNode;
}

export function AppShell({ header, sidebar, children }: AppShellProps) {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '320px 1fr',
            gridTemplateRows: '60px 1fr',
            height: '100vh',
            width: '100vw',
            overflow: 'hidden',
            background: 'var(--bg-primary)'
        }}>
            <header style={{
                gridColumn: '1 / -1',
                borderBottom: '1px solid var(--border-color)',
                background: 'rgba(5, 5, 5, 0.8)',
                backdropFilter: 'blur(10px)',
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                padding: '0 20px',
                justifyContent: 'space-between'
            }}>
                {header}
            </header>

            <aside style={{
                gridColumn: '1',
                gridRow: '2',
                borderRight: '1px solid var(--border-color)',
                background: 'rgba(20, 20, 20, 0.4)',
                backdropFilter: 'blur(10px)',
                overflowY: 'auto',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
            }}>
                {sidebar}
            </aside>

            <main style={{
                gridColumn: '2',
                gridRow: '2',
                position: 'relative',
                background: '#000'
            }}>
                {children}
            </main>
        </div>
    );
}
