import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Confetti from 'react-confetti'
import MAPAVAZIO from '../assets/MAPAVAZIO.png'
import SUL from '../assets/SUL.png'
import SUDESTE from '../assets/SUDESTE.png'
import CENTROOESTE from '../assets/CENTROOESTE.png'
import NORDESTE from '../assets/NORDESTE.png'
import NORTE from '../assets/NORTE.png'

// Preenchimento padrão (laranja da marca). Se houver imagem de preenchimento,
// ela é revelada através do formato do Brasil (máscara).
const ORANGE_FILL = 'linear-gradient(to top, hsl(22 92% 46%), hsl(32 96% 60%))'

// Ordem de preenchimento (de baixo pra cima): Sul → Sudeste → Centro-Oeste → Nordeste → Norte.
const REGIONS = [
  { name: 'Sul', image: SUL, order: 0 },
  { name: 'Sudeste', image: SUDESTE, order: 1 },
  { name: 'Centro-Oeste', image: CENTROOESTE, order: 2 },
  { name: 'Nordeste', image: NORDESTE, order: 3 },
  { name: 'Norte', image: NORTE, order: 4 },
]

function brl(v) {
  return `R$ ${(Number(v) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
}

function regionFill(order, value, perRegion) {
  if (perRegion <= 0) return 0
  const start = order * perRegion
  const end = (order + 1) * perRegion
  if (value >= end) return 100
  if (value > start) return ((value - start) / perRegion) * 100
  return 0
}

// Tween do valor exibido: sobe suavemente do anterior pro atual.
function useAnimatedValue(target, duration = 1600) {
  const [value, setValue] = useState(target)
  const fromRef = useRef(target)
  const rafRef = useRef()
  useEffect(() => {
    const from = fromRef.current
    const to = target
    if (from === to) { setValue(to); return }
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(from + (to - from) * eased)
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
      else fromRef.current = to
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => rafRef.current && cancelAnimationFrame(rafRef.current)
  }, [target, duration])
  return value
}

export default function ThermometerDisplay({ alvo, valorAtual, fillImage, isProjectionMode = false }) {
  const goal = parseFloat(alvo) || 0
  const target = parseFloat(valorAtual) || 0
  const value = useAnimatedValue(target)
  const perRegion = goal > 0 ? goal / REGIONS.length : 0
  const pct = goal > 0 ? (value / goal) * 100 : 0
  const pctClamped = Math.min(100, Math.max(0, pct))
  const reached = goal > 0 && target >= goal
  const filledCount = REGIONS.filter((r) => regionFill(r.order, value, perRegion) >= 100).length

  const [win, setWin] = useState({
    w: typeof window !== 'undefined' ? window.innerWidth : 1280,
    h: typeof window !== 'undefined' ? window.innerHeight : 720,
  })
  useEffect(() => {
    const onResize = () => setWin({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const fillStyle = fillImage
    ? { backgroundImage: `url(${fillImage})`, backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat' }
    : { background: ORANGE_FILL }

  if (!alvo || !valorAtual) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-6">
        <div className="max-w-md text-center bg-white/80 backdrop-blur rounded-2xl shadow-lg p-8">
          <div className="text-sm uppercase tracking-[0.2em] font-semibold text-orange-600 mb-2">Termômetro Missionário</div>
          <p className="text-gray-600">Configure o <strong>Alvo</strong> e o <strong>Valor Atual</strong> na barra lateral para ver o progresso da campanha.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 min-h-screen flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {isProjectionMode && reached && (
        <Confetti width={win.w} height={win.h} recycle={false} numberOfPieces={500} colors={['#ea580c', '#fb923c', '#fde68a', '#ffffff']} />
      )}
      <div className="w-full max-w-6xl">
        <div className="text-center mb-6 md:mb-10">
          <div className={`uppercase tracking-[0.2em] font-semibold text-orange-600 ${isProjectionMode ? 'text-sm md:text-base' : 'text-xs md:text-sm'}`}>
            Termômetro Missionário
          </div>
          {reached && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2 text-white shadow-lg animate-pulse">
              <span className="font-bold text-lg">Alvo alcançado! 🎉</span>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12">
          {/* Termômetro lateral */}
          <div className="flex flex-row lg:flex-col items-center gap-3 shrink-0">
            <div className={`relative rounded-full bg-gray-200/80 overflow-hidden shadow-inner border border-orange-200 ${isProjectionMode ? 'w-16 h-80 md:w-20 md:h-[30rem]' : 'w-14 h-72 md:h-96'}`}>
              <motion.div
                className="absolute bottom-0 left-0 w-full rounded-full"
                style={{ background: 'linear-gradient(to top, #ea580c, #fb923c)' }}
                animate={{ height: `${pctClamped}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
              <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none">
                {[100, 75, 50, 25, 0].map((m) => (
                  <div key={m} className="flex items-center justify-end pr-1.5 gap-1">
                    <span className={`text-gray-500 ${isProjectionMode ? 'text-xs' : 'text-[10px]'}`}>{m}</span>
                    <div className="h-px w-2 bg-gray-400/60" />
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <div className={`font-bold tabular-nums text-orange-600 ${isProjectionMode ? 'text-5xl md:text-6xl' : 'text-3xl md:text-4xl'}`}>
                {pct.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500">do alvo</div>
            </div>
          </div>

          {/* Mapa do Brasil */}
          <div className={`relative w-full min-w-0 mx-auto ${isProjectionMode ? 'max-w-3xl' : 'max-w-xl'}`}>
            <img src={MAPAVAZIO} alt="Mapa do Brasil" className="w-full h-auto relative z-10 opacity-90" />
            {REGIONS.map((region) => {
              const fill = regionFill(region.order, value, perRegion)
              if (fill <= 0) return null
              return (
                <motion.div
                  key={region.name}
                  className="absolute inset-0 z-20"
                  style={{
                    WebkitMaskImage: `url(${region.image})`,
                    maskImage: `url(${region.image})`,
                    WebkitMaskSize: '100% 100%',
                    maskSize: '100% 100%',
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    ...fillStyle,
                    clipPath: `inset(${100 - fill}% 0 0 0)`,
                    WebkitClipPath: `inset(${100 - fill}% 0 0 0)`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              )
            })}
          </div>

          {/* Valores + regiões */}
          <div className={`flex flex-col gap-3 w-full shrink-0 ${isProjectionMode ? 'lg:w-80' : 'lg:w-72'}`}>
            <div className="rounded-xl border border-orange-100 bg-white px-4 py-3 shadow-sm">
              <div className="text-xs uppercase tracking-wide text-gray-400">Arrecadado</div>
              <div className={`font-bold tabular-nums text-orange-600 whitespace-nowrap ${isProjectionMode ? 'text-3xl' : 'text-2xl'}`}>{brl(value)}</div>
            </div>
            <div className="rounded-xl border border-orange-100 bg-white px-4 py-3 shadow-sm">
              <div className="text-xs uppercase tracking-wide text-gray-400">Alvo</div>
              <div className={`font-semibold tabular-nums text-gray-800 whitespace-nowrap ${isProjectionMode ? 'text-2xl' : 'text-xl'}`}>{brl(goal)}</div>
            </div>
            <div className="text-xs text-gray-500 text-center">{filledCount} de {REGIONS.length} regiões completas</div>
            <div className="flex flex-col gap-1.5">
              {REGIONS.slice().reverse().map((region) => {
                const fill = regionFill(region.order, value, perRegion)
                const state = fill >= 100 ? 'done' : fill > 0 ? 'partial' : 'wait'
                return (
                  <div
                    key={region.name}
                    className={`flex items-center justify-between rounded-md border px-3 py-1.5 text-xs ${
                      state === 'done'
                        ? 'border-orange-300 bg-orange-100 text-orange-800'
                        : state === 'partial'
                        ? 'border-orange-200 bg-orange-50 text-orange-700'
                        : 'border-gray-200 bg-gray-50 text-gray-400'
                    }`}
                  >
                    <span className="font-medium">{region.name}</span>
                    <span className="tabular-nums">{state === 'done' ? '✓' : state === 'partial' ? `${fill.toFixed(0)}%` : '—'}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
