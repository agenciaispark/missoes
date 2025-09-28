import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import MAPAVAZIO from '../assets/MAPAVAZIO.png'
import SUL from '../assets/SUL.png'
import SUDESTE from '../assets/SUDESTE.png'
import CENTROOESTE from '../assets/CENTROOESTE.png'
import NORDESTE from '../assets/NORDESTE.png'
import NORTE from '../assets/NORTE.png'

const ThermometerDisplay = ({ alvo, valorAtual, isProjectionMode = false }) => {
  const [percentage, setPercentage] = useState(0)

  useEffect(() => {
    if (alvo && valorAtual) {
      const newPercentage = Math.min((parseFloat(valorAtual) / parseFloat(alvo)) * 100, 100)
      setPercentage(newPercentage)
    } else {
      setPercentage(0)
    }
  }, [alvo, valorAtual])

  // Ordem de preenchimento: Sul > Sudeste > Centro-Oeste > Nordeste > Norte
  const regions = [
    { name: 'Sul', image: SUL, order: 0 },
    { name: 'Sudeste', image: SUDESTE, order: 1 },
    { name: 'Centro-Oeste', image: CENTROOESTE, order: 2 },
    { name: 'Nordeste', image: NORDESTE, order: 3 },
    { name: 'Norte', image: NORTE, order: 4 },
  ]

  const totalRegions = regions.length
  const valorPorRegiao = alvo ? parseFloat(alvo) / totalRegions : 0

  // Calcular o status de cada região
  const getRegionStatus = (regionOrder) => {
    if (!alvo || !valorAtual) return { filled: false, fillPercentage: 0, valorNecessario: 0, valorRestante: 0 }
    
    const valorAtualNum = parseFloat(valorAtual)
    const valorInicioRegiao = regionOrder * valorPorRegiao
    const valorFimRegiao = (regionOrder + 1) * valorPorRegiao
    
    let fillPercentage = 0
    let filled = false
    
    if (valorAtualNum >= valorFimRegiao) {
      // Região completamente preenchida
      fillPercentage = 100
      filled = true
    } else if (valorAtualNum > valorInicioRegiao) {
      // Região parcialmente preenchida
      const valorNaRegiao = valorAtualNum - valorInicioRegiao
      fillPercentage = (valorNaRegiao / valorPorRegiao) * 100
      filled = false
    } else {
      // Região não preenchida
      fillPercentage = 0
      filled = false
    }
    
    const valorRestante = Math.max(0, valorFimRegiao - valorAtualNum)
    
    return {
      filled,
      fillPercentage,
      valorNecessario: valorPorRegiao,
      valorRestante,
      valorInicioRegiao,
      valorFimRegiao
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 p-4 md:p-8">
      <div className="text-center max-w-7xl mx-auto w-full">
        <div className="mb-4 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">Termômetro Missionário</h1>
          <p className="text-sm md:text-lg text-gray-600">Minha Pátria Para Cristo 2025</p>
        </div>

        <div className="flex flex-col lg:flex-row items-start justify-center gap-4 lg:gap-8">
          {/* Termômetro lateral */}
          {alvo && valorAtual && (
            <div className="flex flex-col items-center order-2 lg:order-1">
              <div className="relative w-12 h-60 md:w-16 md:h-80 bg-gray-200 rounded-full overflow-hidden shadow-lg">
                <motion.div
                  className="absolute bottom-0 left-0 w-full rounded-full"
                  style={{
                    background: percentage >= 100 ? '#22c55e' :
                               percentage >= 75 ? '#eab308' :
                               percentage >= 50 ? '#f97316' :
                               percentage >= 25 ? '#ef4444' : '#dc2626'
                  }}
                  initial={{ height: '0%' }}
                  animate={{ height: `${percentage}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
                {/* Marcações do termômetro */}
                <div className="absolute inset-0 flex flex-col justify-between py-2">
                  {[100, 75, 50, 25, 0].map((mark) => (
                    <div key={mark} className="flex items-center">
                      <div className="w-4 h-0.5 bg-gray-400 ml-auto mr-1"></div>
                      <span className="text-xs text-gray-600 w-8">{mark}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {percentage.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">
                  Progresso
                </div>
              </div>
            </div>
          )}

          {/* Container principal com mapa e informações */}
          <div className="flex flex-col xl:flex-row gap-4 xl:gap-8 items-start order-1 lg:order-2 w-full">
            {/* Mapa principal */}
            <div className="relative mb-4 xl:mb-8 max-w-3xl mx-auto xl:mx-0 flex-1">
            <div className="relative bg-white rounded-lg shadow-2xl p-2 md:p-4">
              {/* Mapa base vazio */}
              <img 
                src={MAPAVAZIO} 
                alt="Mapa do Brasil Vazio" 
                className="w-full h-auto max-w-full mx-auto relative z-10" 
              />

              {/* Sobreposição dos adesivos das regiões */}
              {regions.map((region) => {
                const status = getRegionStatus(region.order)
                const isVisible = status.fillPercentage > 0

                return (
                  <div key={region.name} className="absolute inset-0 p-4">
                    {isVisible && (
                      <motion.div
                        className="relative w-full h-full overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: region.order * 0.2 }}
                      >
                        {status.filled ? (
                          // Região completamente preenchida
                          <motion.img
                            src={region.image}
                            alt={`${region.name} preenchido`}
                            className="w-full h-auto max-w-full mx-auto absolute top-0 left-0"
                            initial={{ y: '10%' }}
                            animate={{ y: '0%' }}
                            transition={{ duration: 1.2, ease: 'easeOut', delay: region.order * 0.2 }}
                          />
                        ) : (
                          // Região parcialmente preenchida com degradê
                          <div className="relative w-full h-full">
                            {/* Parte preenchida (de baixo para cima) */}
                            <motion.img
                              src={region.image}
                              alt={`${region.name} preenchido parcial`}
                              className="w-full h-auto max-w-full mx-auto absolute top-0 left-0"
                              style={{
                                clipPath: `inset(${100 - status.fillPercentage}% 0 0 0)`,
                                WebkitClipPath: `inset(${100 - status.fillPercentage}% 0 0 0)`,
                              }}
                              initial={{ y: '10%' }}
                              animate={{ y: '0%' }}
                              transition={{ duration: 1.2, ease: 'easeOut', delay: region.order * 0.2 }}
                            />
                            
                            {/* Efeito de degradê na parte superior */}
                            <motion.div
                              className="absolute top-0 left-0 w-full h-full"
                              style={{
                                background: `linear-gradient(to bottom, 
                                  rgba(255,255,255,0.9) 0%, 
                                  rgba(255,255,255,0.7) ${Math.max(0, status.fillPercentage - 10)}%, 
                                  rgba(255,255,255,0.3) ${status.fillPercentage}%, 
                                  transparent ${Math.min(100, status.fillPercentage + 5)}%)`,
                                clipPath: `inset(${Math.max(0, status.fillPercentage - 15)}% 0 ${Math.max(0, 100 - status.fillPercentage - 15)}% 0)`,
                                WebkitClipPath: `inset(${Math.max(0, status.fillPercentage - 15)}% 0 ${Math.max(0, 100 - status.fillPercentage - 15)}% 0)`,
                              }}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.8, ease: 'easeOut', delay: region.order * 0.2 + 0.5 }}
                            >
                              <img
                                src={region.image}
                                alt={`${region.name} degradê`}
                                className="w-full h-auto max-w-full mx-auto opacity-60"
                              />
                            </motion.div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                )
              })}
                  {/* Destaque do valor do alvo */}
              {alvo && !isProjectionMode && (
                <motion.div
                  className="absolute top-2 right-2 md:top-4 md:right-4 bg-blue-600 text-white px-2 py-1 md:px-4 md:py-2 rounded-lg shadow-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="text-xs md:text-sm font-medium">Alvo</div>
                  <div className="text-sm md:text-lg font-bold">
                    R$ {parseFloat(alvo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Percentual e informações gerais (apenas no modo normal) */}
            {!isProjectionMode && (
              <>
                <motion.div
                  className="text-4xl md:text-6xl font-bold mt-4 md:mt-6"
                  style={{
                    color: percentage >= 100 ? '#22c55e' :
                           percentage >= 75 ? '#eab308' :
                           percentage >= 50 ? '#f97316' :
                           percentage >= 25 ? '#ef4444' : '#dc2626'
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  {percentage.toFixed(1)}%
                </motion.div>

                <div className="mt-4 text-lg font-semibold text-gray-700">
                  {regions.filter(region => getRegionStatus(region.order).filled).length} de {totalRegions} regiões preenchidas
                </div>
              </>
            )}
          </div>

          {/* Blocos de informações das regiões à direita do mapa */}
          {alvo && valorAtual && (
            <div className="flex flex-col gap-2 md:gap-3 w-full xl:w-64 xl:flex-shrink-0">
              {/* Ordem: Sul > Sudeste > Centro-Oeste > Nordeste > Norte (de baixo para cima) */}
              {regions.slice().reverse().map((region) => {
                const status = getRegionStatus(region.order)
                const isComplete = status.filled
                const isPartial = status.fillPercentage > 0 && !status.filled
                const isWaiting = status.fillPercentage === 0
                
                return (
                  <motion.div
                    key={region.name}
                    className={`p-3 md:p-4 rounded-lg transition-all duration-300 shadow-md ${
                      isComplete 
                        ? 'bg-green-100 text-green-800 border-2 border-green-300' 
                        : isPartial
                        ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                        : 'bg-gray-100 text-gray-500 border-2 border-gray-200'
                    }`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: region.order * 0.1 }}
                  >
                    <div className="font-bold text-base md:text-lg mb-1 md:mb-2">{region.name}</div>
                    <div className="text-xs md:text-sm mb-1 md:mb-2">
                      {isComplete ? '✓ Completa' : isPartial ? `◐ ${status.fillPercentage.toFixed(0)}%` : 'Aguardando'}
                    </div>
                    <div className="text-xs md:text-sm space-y-1">
                      <div>Meta: R$ {status.valorNecessario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                      {status.valorRestante > 0 && (
                        <div className="text-red-600 font-semibold">
                          Falta: R$ {status.valorRestante.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
        </div>

        {alvo && valorAtual && !isProjectionMode && (
          <motion.div
            className="bg-white rounded-lg shadow-lg p-4 md:p-6 max-w-md mx-auto mt-4 md:mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-500 mb-1">Valor Atual</p>
                <p className="text-xl font-bold text-gray-800">
                  R$ {parseFloat(valorAtual).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Alvo</p>
                <p className="text-xl font-bold text-gray-800">
                  R$ {parseFloat(alvo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Valor por Região</p>
                <p className="text-lg font-bold text-blue-600">
                  R$ {valorPorRegiao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500 mb-1">
                {parseFloat(valorAtual) >= parseFloat(alvo) ? 'Meta superada em' : 'Faltam'}
              </p>
              <p className={`text-lg font-bold ${parseFloat(valorAtual) >= parseFloat(alvo) ? 'text-green-600' : 'text-red-600'}`}>
                R$ {Math.abs(parseFloat(alvo) - parseFloat(valorAtual)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </motion.div>
        )}

        {(!alvo || !valorAtual) && (
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
            <p className="text-gray-500 text-center">
              Configure o alvo e o valor atual na barra lateral para ver o progresso da campanha missionária.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ThermometerDisplay
