FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY src src
COPY .eslintrc.json jest.config.js ./

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app .
EXPOSE 3000
CMD ["node", "src/server.js"]
