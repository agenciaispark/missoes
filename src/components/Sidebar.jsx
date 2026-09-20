import { useRef } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { ChevronLeft, ChevronRight, MonitorPlay, ImagePlus, X } from 'lucide-react'

const Sidebar = ({ alvo, valorAtual, fillImage, onAlvoChange, onValorAtualChange, onFillImageChange, isCollapsed, onToggleCollapse }) => {
  const fileRef = useRef(null)

  const handleNumberChange = (setter) => (e) => {
    const value = e.target.value
    if (value === '' || (!isNaN(value) && parseFloat(value) >= 0)) setter(value)
  }

  const handleFile = (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onFillImageChange(String(reader.result))
    reader.readAsDataURL(file)
  }

  const handleProjection = () => {
    // Abrir em JANELA separada (não aba) — arraste para o 2º monitor e dê F11.
    const w = Math.min(1280, Math.round(window.screen.availWidth * 0.8))
    const h = Math.min(800, Math.round(window.screen.availHeight * 0.85))
    const left = window.screenX + 60
    const top = window.screenY + 60
    const url = `${window.location.origin}${window.location.pathname}?projection=true`
    const win = window.open(url, 'termometro_projecao', `popup=yes,width=${w},height=${h},left=${left},top=${top}`)
    if (win) win.focus()
  }

  const progresso = alvo && valorAtual && parseFloat(alvo) > 0 ? (parseFloat(valorAtual) / parseFloat(alvo)) * 100 : 0

  return (
    <div className={`lg:fixed lg:left-0 lg:top-0 lg:h-full bg-white border-r border-b lg:border-b-0 border-orange-100 transition-all duration-300 z-10 ${isCollapsed ? 'lg:w-12 w-full h-auto' : 'lg:w-80 w-full h-auto lg:h-full'}`}>
      <Button
        variant="ghost"
        size="sm"
        className="hidden lg:block absolute -right-3 top-4 z-20 bg-white border border-orange-200 rounded-full p-1 h-6 w-6"
        onClick={() => onToggleCollapse(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      <div className={`p-2 md:p-4 h-full ${isCollapsed ? 'lg:hidden' : 'block'}`}>
        <Card className="h-auto lg:h-full border-orange-100">
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="text-base md:text-lg font-bold text-gray-800">Termômetro Missionário</CardTitle>
            <p className="text-xs md:text-sm text-gray-500">Informe o alvo e o valor arrecadado</p>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="alvo" className="text-sm font-medium">Alvo Missionário (R$)</Label>
              <Input id="alvo" type="number" inputMode="decimal" placeholder="Ex: 50000" value={alvo} onChange={handleNumberChange(onAlvoChange)} min="0" step="0.01" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="valorAtual" className="text-sm font-medium">Valor Arrecadado (R$)</Label>
              <Input id="valorAtual" type="number" inputMode="decimal" placeholder="Ex: 25000" value={valorAtual} onChange={handleNumberChange(onValorAtualChange)} min="0" step="0.01" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Imagem do mapa (opcional)</Label>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
              {fillImage ? (
                <div className="flex items-center gap-2">
                  <img src={fillImage} alt="Prévia" className="h-10 w-10 rounded object-cover border border-orange-200" />
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => fileRef.current && fileRef.current.click()}>Trocar</Button>
                  <Button variant="ghost" size="sm" onClick={() => onFillImageChange(null)} title="Remover"><X className="h-4 w-4" /></Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" className="w-full" onClick={() => fileRef.current && fileRef.current.click()}>
                  <ImagePlus className="w-4 h-4 mr-2" /> Enviar imagem
                </Button>
              )}
              <p className="text-[11px] text-gray-400 leading-snug">A imagem é revelada através do formato do Brasil. Sem imagem, o mapa usa o laranja.</p>
            </div>

            {alvo && valorAtual && (
              <div className="pt-1">
                <Button onClick={handleProjection} className="w-full bg-orange-500 hover:bg-orange-600 text-white" size="lg">
                  <MonitorPlay className="w-4 h-4 mr-2" /> Projetar em 2ª tela
                </Button>
                <p className="text-[11px] text-gray-400 mt-1.5 text-center">Abre uma janela separada — arraste pro telão e dê F11.</p>
              </div>
            )}

            {alvo && valorAtual && (
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                <h3 className="font-semibold text-sm mb-2 text-gray-700">Progresso da campanha</h3>
                <div className="space-y-1 text-sm text-gray-700">
                  <div className="flex justify-between"><span>Alvo:</span><span className="font-medium tabular-nums">R$ {parseFloat(alvo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
                  <div className="flex justify-between"><span>Arrecadado:</span><span className="font-medium tabular-nums">R$ {parseFloat(valorAtual).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
                  <div className="flex justify-between border-t border-orange-200 pt-1"><span>Progresso:</span><span className="font-bold text-orange-600 tabular-nums">{progresso.toFixed(1)}%</span></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Sidebar
