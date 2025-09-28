# Termômetro Missionário

## Descrição

O Termômetro Missionário é uma aplicação web interativa desenvolvida para visualizar o progresso de campanhas ou projetos missionários. Ele permite que os usuários definam um valor alvo e acompanhem o valor atual, exibindo o progresso de forma dinâmica em um mapa do Brasil e um termômetro lateral. As regiões do mapa são preenchidas progressivamente à medida que o valor atual se aproxima do alvo, fornecendo uma representação visual clara do avanço da campanha.

## Funcionalidades

*   **Visualização de Progresso:** Acompanhamento visual do progresso da campanha através de um mapa interativo do Brasil e um termômetro lateral.
*   **Definição de Alvo e Valor Atual:** Campos de entrada na barra lateral para configurar o valor total da campanha (Alvo) e o valor já arrecadado/atingido (Valor Atual).
*   **Informações Detalhadas por Região:** Blocos de informação exibidos à direita do mapa, detalhando o status de cada região (Sul, Sudeste, Centro-Oeste, Nordeste, Norte), incluindo o valor necessário, o percentual de preenchimento e o valor restante.
*   **Destaque do Valor do Alvo:** O valor do alvo é exibido em destaque próximo ao mapa para fácil visualização.
*   **Modo de Projeção:** Um botão "Projetar em Segunda Tela" na barra lateral permite abrir uma nova janela (ou tentar tela cheia em um segundo monitor) com uma versão simplificada da interface, ideal para projeções em eventos ou reuniões. Neste modo, informações adicionais como o percentual geral e o card de detalhes financeiros são ocultadas para focar na visualização principal.
*   **Interface Responsiva:** Desenvolvido com Tailwind CSS e componentes Radix UI para uma experiência de usuário moderna e adaptável.

## Tecnologias Utilizadas

*   **Frontend:** React.js
*   **Build Tool:** Vite
*   **Estilização:** Tailwind CSS
*   **Componentes UI:** Radix UI
*   **Animações:** Framer Motion
*   **Ícones:** Lucide React
*   **Gerenciador de Pacotes:** pnpm

## Configuração e Execução Local

Para configurar e executar o projeto em sua máquina local, siga os passos abaixo:

1.  **Clone o Repositório:**
    ```bash
    git clone https://github.com/agenciaispark/missoes.git
    cd missoes
    ```

2.  **Instale as Dependências:**
    Certifique-se de ter o `pnpm` instalado. Se não tiver, você pode instalá-lo globalmente via npm: `npm install -g pnpm`.
    ```bash
    pnpm install
    ```

3.  **Inicie o Servidor de Desenvolvimento:**
    ```bash
    pnpm dev
    ```

    A aplicação estará disponível em `http://localhost:5173/` (ou outra porta, se 5173 estiver em uso).

## Uso da Aplicação

1.  **Configurar Valores:** Na barra lateral esquerda, insira o **Alvo da Campanha (R$)** e o **Valor Atual (R$)**.
2.  **Visualizar Progresso:** O mapa do Brasil e o termômetro lateral se atualizarão dinamicamente para refletir o progresso.
3.  **Detalhes por Região:** Observe os blocos à direita do mapa para ver o status individual de cada região.
4.  **Modo de Projeção:** Clique no botão "Projetar em Segunda Tela" na barra lateral para abrir a visualização otimizada para projeção em uma nova janela.
