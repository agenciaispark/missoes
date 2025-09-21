import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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

  return (
    <div className={`fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 z-10 ${
      isCollapsed ? 'w-12' : 'w-80'
    }`}>
      {/* Botão de recolher/expandir */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute -right-3 top-4 z-20 bg-background border border-border rounded-full p-1 h-6 w-6"
        onClick={() => onToggleCollapse(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      {/* Conteúdo da sidebar */}
      <div className={`p-4 h-full ${isCollapsed ? 'hidden' : 'block'}`}>
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-sidebar-foreground">
              Termômetro Missionário
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Configure os valores da campanha
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
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
