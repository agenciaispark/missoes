import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar.jsx'
import ThermometerDisplay from './components/ThermometerDisplay.jsx'
import './App.css'

function App() {
  const [alvo, setAlvo] = useState('')
  const [valorAtual, setValorAtual] = useState('')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isProjectionMode, setIsProjectionMode] = useState(false)

  useEffect(() => {
    // Verificar se está em modo de projeção através dos parâmetros da URL
    const urlParams = new URLSearchParams(window.location.search)
    const projection = urlParams.get('projection')
    const urlAlvo = urlParams.get('alvo')
    const urlValorAtual = urlParams.get('valorAtual')

    if (projection === 'true') {
      setIsProjectionMode(true)
      if (urlAlvo) setAlvo(urlAlvo)
      if (urlValorAtual) setValorAtual(urlValorAtual)
    }
  }, [])

  if (isProjectionMode) {
    // Modo de projeção: apenas o display do termômetro em tela cheia
    return (
      <div className="h-screen bg-background">
        <ThermometerDisplay
          alvo={alvo}
          valorAtual={valorAtual}
          isProjectionMode={isProjectionMode}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-background">
      <Sidebar
        alvo={alvo}
        valorAtual={valorAtual}
        onAlvoChange={setAlvo}
        onValorAtualChange={setValorAtual}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={setSidebarCollapsed}
      />
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-12' : 'lg:ml-80'}`}>
        <ThermometerDisplay
          alvo={alvo}
          valorAtual={valorAtual}
          isProjectionMode={isProjectionMode}
        />
      </div>
    </div>
  )
}

export default App
