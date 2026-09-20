# Termômetro Missionário

## Descrição

O Termômetro Missionário é uma aplicação web interativa desenvolvida para visualizar o progresso de campanhas ou projetos missionários. Ele permite que os usuários definam um valor alvo e acompanhem o valor atual, exibindo o progresso de forma dinâmica em um mapa do Brasil e um termômetro lateral. As regiões do mapa são preenchidas progressivamente à medida que o valor atual se aproxima do alvo, fornecendo uma representação visual clara do avanço da campanha.

## Funcionalidades

*   **Mapa do Brasil que enche:** as 5 regiões (Sul → Sudeste → Centro-Oeste → Nordeste → Norte) são preenchidas de baixo pra cima conforme o valor arrecadado se aproxima do alvo, com um termômetro lateral e o percentual em destaque.
*   **Alvo e Valor Arrecadado:** campos simples na barra lateral. Sem banco de dados — cada sessão é carregada na hora.
*   **Imagem de preenchimento (opcional):** envie uma imagem (arte da campanha, foto) e ela é revelada através do formato do Brasil. Sem imagem, o mapa usa o laranja da marca.
*   **Projeção na 2ª tela, ao vivo:** o botão "Projetar em 2ª tela" abre uma janela separada (arraste para o telão e dê F11). O que você digita na tela de controle **atualiza a projeção na hora** — sincronização feita 100% no navegador (`BroadcastChannel` + `localStorage`), sem servidor.
*   **Confete ao bater o alvo:** quando o arrecadado atinge o alvo, a projeção mostra "Alvo alcançado!" com confete.
*   **Interface Responsiva:** Tailwind CSS + componentes Radix UI + animações com Framer Motion.

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

1.  **Informe os valores:** na barra lateral, digite o **Alvo Missionário (R$)** e o **Valor Arrecadado (R$)**. Opcionalmente, envie uma **imagem** para preencher o mapa.
2.  **Projete no telão:** clique em **"Projetar em 2ª tela"**, arraste a janela para o segundo monitor e dê **F11** (tela cheia).
3.  **Atualize ao vivo:** volte para a tela de controle e vá alterando o **Valor Arrecadado** — a projeção enche o mapa na hora, sem recarregar.
4.  **Bateu o alvo:** ao atingir 100%, a projeção celebra com **confete**.
