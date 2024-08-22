FROM node:20-alpine AS development
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
COPY .env .env
RUN npm ci -f
COPY --chown=node:node . .
USER node

FROM node:20-alpine AS build
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .
COPY .env .env
RUN npx prisma generate
RUN npm run build
RUN npm ci -f --only=production && npm cache clean --force
USER node

FROM node:20-alpine AS production
ENV NODE_ENV production
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY ./src/views ./src/views
COPY ./src/public ./src/public
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY .env .env
EXPOSE 3000
CMD [ "node", "dist/src/main.js" ]