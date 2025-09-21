import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import ThermometerDisplay from './components/ThermometerDisplay.jsx'
import './App.css'

function App() {
  const [alvo, setAlvo] = useState('')
  const [valorAtual, setValorAtual] = useState('')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        alvo={alvo}
        valorAtual={valorAtual}
        onAlvoChange={setAlvo}
        onValorAtualChange={setValorAtual}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={setSidebarCollapsed}
      />
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-12' : 'ml-80'}`}>
        <ThermometerDisplay
          alvo={alvo}
          valorAtual={valorAtual}
        />
      </div>
    </div>
  )
}

export default App
