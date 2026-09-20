# Estágio 1: Construção (Build) do projeto React
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
# pnpm 9 builda as deps nativas (@tailwindcss/oxide, esbuild) por padrão —
# o pnpm 10 exige aprovação manual dos build scripts e trava o build em CI.
RUN npm install -g pnpm@9 && pnpm install --no-frozen-lockfile
COPY . .
RUN pnpm run build

# Estágio 2: Servidor de produção (com Nginx)
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
