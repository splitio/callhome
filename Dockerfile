# Builder stage
FROM node:lts-alpine3.13 AS builder

WORKDIR /usr/src/split-evaluator

COPY package.json package-lock.json ./

RUN npm install --only=production

# Runner stage
FROM node:lts-alpine3.13 AS runner

WORKDIR /usr/src/split-evaluator

COPY --from=builder /usr/src/split-evaluator/node_modules ./node_modules

COPY . .

EXPOSE 7548

ENV SPLIT_EVALUATOR_SERVER_PORT=7548

ENTRYPOINT ["npm", "start"]
