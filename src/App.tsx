import { VisualCanvas } from './components/Canvas/VisualCanvas'
import { AppShell } from './components/Layout/AppShell'
import { Header } from './components/Layout/Header'
import { Sidebar } from './components/Layout/Sidebar'
import { useState, useEffect } from 'react'
import { midiManager } from './midi/MidiManager'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // on mobile, default to closed
    if (window.innerWidth < 768) setIsSidebarOpen(false);

    midiManager.init();
  }, []);

  return (
    <AppShell
      header={<Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />}
      sidebar={<Sidebar />}
      isSidebarOpen={isSidebarOpen}
    >
      <VisualCanvas />
    </AppShell>
  )
}

export default App
