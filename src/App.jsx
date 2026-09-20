import { useState, useEffect, useRef } from 'react'
import Sidebar from './components/Sidebar.jsx'
import ThermometerDisplay from './components/ThermometerDisplay.jsx'
import './App.css'

// Sincronização entre a tela de controle e a projeção — 100% no navegador,
// sem servidor: BroadcastChannel (ao vivo entre janelas) + localStorage
// (estado inicial e fallback via evento 'storage').
const CHANNEL = 'termometro-missionario'
const LS_KEY = 'termometro-missionario:estado'

function lerEstado() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return null
}

function App() {
  const [alvo, setAlvo] = useState('')
  const [valorAtual, setValorAtual] = useState('')
  const [fillImage, setFillImage] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isProjectionMode, setIsProjectionMode] = useState(false)
  const bcRef = useRef(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const projection = params.get('projection') === 'true'
    setIsProjectionMode(projection)

    // Estado inicial: localStorage (compartilhado na mesma origem) e, em último
    // caso, parâmetros da URL (compatível com o formato antigo de projeção).
    const salvo = lerEstado()
    if (salvo) {
      setAlvo(salvo.alvo ?? '')
      setValorAtual(salvo.valorAtual ?? '')
      setFillImage(salvo.fillImage ?? null)
    } else if (projection) {
      if (params.get('alvo')) setAlvo(params.get('alvo'))
      if (params.get('valorAtual')) setValorAtual(params.get('valorAtual'))
    }

    let bc = null
    try {
      bc = new BroadcastChannel(CHANNEL)
      bcRef.current = bc
      bc.onmessage = (ev) => {
        const s = ev.data || {}
        setAlvo(s.alvo ?? '')
        setValorAtual(s.valorAtual ?? '')
        setFillImage(s.fillImage ?? null)
      }
    } catch { /* BroadcastChannel indisponível: cai no 'storage' abaixo */ }

    const onStorage = (e) => {
      if (e.key === LS_KEY && e.newValue) {
        try {
          const s = JSON.parse(e.newValue)
          setAlvo(s.alvo ?? '')
          setValorAtual(s.valorAtual ?? '')
          setFillImage(s.fillImage ?? null)
        } catch { /* ignore */ }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('storage', onStorage)
      if (bc) bc.close()
    }
  }, [])

  // Ao alterar na tela de controle: persiste + transmite pra projeção.
  const publicar = (next) => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)) } catch { /* ignore */ }
    try { bcRef.current && bcRef.current.postMessage(next) } catch { /* ignore */ }
  }
  const updateAlvo = (v) => { setAlvo(v); publicar({ alvo: v, valorAtual, fillImage }) }
  const updateValorAtual = (v) => { setValorAtual(v); publicar({ alvo, valorAtual: v, fillImage }) }
  const updateFillImage = (v) => { setFillImage(v); publicar({ alvo, valorAtual, fillImage: v }) }

  if (isProjectionMode) {
    return (
      <div className="h-screen bg-background">
        <ThermometerDisplay alvo={alvo} valorAtual={valorAtual} fillImage={fillImage} isProjectionMode />
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background">
      <Sidebar
        alvo={alvo}
        valorAtual={valorAtual}
        fillImage={fillImage}
        onAlvoChange={updateAlvo}
        onValorAtualChange={updateValorAtual}
        onFillImageChange={updateFillImage}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={setSidebarCollapsed}
      />
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-12' : 'lg:ml-80'}`}>
        <ThermometerDisplay alvo={alvo} valorAtual={valorAtual} fillImage={fillImage} isProjectionMode={false} />
      </div>
    </div>
  )
}

export default App
