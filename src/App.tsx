import { VisualCanvas } from './components/Canvas/VisualCanvas'
import { AppShell } from './components/Layout/AppShell'
import { Header } from './components/Layout/Header'
import { Sidebar } from './components/Layout/Sidebar'
import { useEffect } from 'react'
import { midiManager } from './midi/MidiManager'

function App() {
  useEffect(() => {
    midiManager.init();
  }, []);

  return (
    <AppShell
      header={<Header />}
      sidebar={<Sidebar />}
    >
      <VisualCanvas />
    </AppShell>
  )
}

export default App
