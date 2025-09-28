import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { ChevronLeft, ChevronRight, Monitor } from 'lucide-react'

const Sidebar = ({ alvo, valorAtual, onAlvoChange, onValorAtualChange, isCollapsed, onToggleCollapse }) => {
  const handleAlvoChange = (e) => {
    const value = e.target.value
    if (value === '' || (!isNaN(value) && parseFloat(value) >= 0)) {
      onAlvoChange(value)
    }
  }

  const handleValorAtualChange = (e) => {
    const value = e.target.value
    if (value === '' || (!isNaN(value) && parseFloat(value) >= 0)) {
      onValorAtualChange(value)
    }
  }

  const handleProjection = () => {
    // Criar URL com parâmetros para a projeção
    const projectionUrl = `${window.location.origin}${window.location.pathname}?projection=true&alvo=${encodeURIComponent(alvo)}&valorAtual=${encodeURIComponent(valorAtual)}`
    
    // Tentar abrir em tela cheia em um segundo monitor, ou em nova janela
    const projectionWindow = window.open(
      projectionUrl,
      'projection',
      'fullscreen=yes,scrollbars=no,resizable=yes,status=no,location=no,toolbar=no,menubar=no'
    )
    
    // Se conseguiu abrir a janela, tentar colocar em tela cheia
    if (projectionWindow) {
      projectionWindow.focus()
      // Tentar tela cheia após um pequeno delay
      setTimeout(() => {
        if (projectionWindow.document && projectionWindow.document.documentElement) {
          if (projectionWindow.document.documentElement.requestFullscreen) {
            projectionWindow.document.documentElement.requestFullscreen().catch(() => {
              // Falha silenciosa se não conseguir entrar em tela cheia
            })
          }
        }
      }, 1000)
    }
  }

  return (
    <div className={`lg:fixed lg:left-0 lg:top-0 lg:h-full bg-sidebar border-r lg:border-r border-b lg:border-b-0 border-sidebar-border transition-all duration-300 z-10 ${
      isCollapsed ? 'lg:w-12 w-full h-auto' : 'lg:w-80 w-full h-auto lg:h-full'
    }`}>
      {/* Botão de recolher/expandir (apenas em desktop) */}
      <Button
        variant="ghost"
        size="sm"
        className="hidden lg:block absolute -right-3 top-4 z-20 bg-background border border-border rounded-full p-1 h-6 w-6"
        onClick={() => onToggleCollapse(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      {/* Conteúdo da sidebar */}
      <div className={`p-2 md:p-4 h-full ${isCollapsed ? 'lg:hidden' : 'block'}`}>
        <Card className="h-full lg:h-full h-auto">
          <CardHeader className="pb-2 md:pb-6">
            <CardTitle className="text-base md:text-lg font-bold text-sidebar-foreground">
              Termômetro Missionário
            </CardTitle>
            <p className="text-xs md:text-sm text-muted-foreground">
              Configure os valores da campanha
            </p>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="alvo" className="text-sm font-medium">
                Alvo da Campanha (R$)
              </Label>
              <Input
                id="alvo"
                type="number"
                placeholder="Ex: 50000"
                value={alvo}
                onChange={handleAlvoChange}
                min="0"
                step="0.01"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valorAtual" className="text-sm font-medium">
                Valor Atual (R$)
              </Label>
              <Input
                id="valorAtual"
                type="number"
                placeholder="Ex: 25000"
                value={valorAtual}
                onChange={handleValorAtualChange}
                min="0"
                step="0.01"
                className="w-full"
              />
            </div>

            {/* Botão de Projeção */}
            {alvo && valorAtual && (
              <div className="mt-6">
                <Button
                  onClick={handleProjection}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  <Monitor className="w-4 h-4 mr-2" />
                  Projetar em Segunda Tela
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Abre o termômetro em tela cheia para projeção
                </p>
              </div>
            )}

            {/* Informações de progresso */}
            {alvo && valorAtual && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold text-sm mb-2">Progresso da Campanha</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Alvo:</span>
                    <span className="font-medium">R$ {parseFloat(alvo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Atual:</span>
                    <span className="font-medium">R$ {parseFloat(valorAtual).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between border-t pt-1">
                    <span>Progresso:</span>
                    <span className="font-bold text-primary">
                      {((parseFloat(valorAtual) / parseFloat(alvo)) * 100).toFixed(1)}%
                    </span>
                  </div>
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
