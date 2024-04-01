FROM node:lts

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production
COPY . .
RUN npx prisma generate

CMD ["npx", "nodemon", "src/index.ts"]
